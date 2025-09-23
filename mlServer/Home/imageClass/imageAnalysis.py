# importing the necessary modules
import os
import pickle
import tensorflow as tf
import numpy as np
import cv2

# Setting the path to the model
modelPath = "models"

# Output path
outputPath = os.path.join(modelPath, 'output')

# Defining a class to load the model
class ImageModelClass:
    def __init__(self, image):
        # Load the model and the image
        self.image = image
        self.detectorModel = os.path.join(modelPath, "faceDetectionModel")
        self.embeddingModel = os.path.join(modelPath, "embeddingModel.t7")
        self.recognizerModel = os.path.join(outputPath, "recognizer.pickle")
        self.labelModel = os.path.join(outputPath, "le.pickle")

        # Loading the serialized face detector model into memory
        self.confidenceValue = 0.5
        self.protoPath = os.path.join(self.detectorModel, 'deploy.prototxt')
        self.modelPath = os.path.join(self.detectorModel, 'res10.caffemodel')
        self.detector = cv2.dnn.readNetFromCaffe(self.protoPath, self.modelPath)

        # Loading the serialized face embedding model into memory
        self.embedder = cv2.dnn.readNetFromTorch(self.embeddingModel)

        # Correcting the way the pickle files are loaded
        self.recognizer = pickle.load(open(self.recognizerModel, "rb"))
        self.le = pickle.load(open(self.labelModel, "rb"))

    # Creating a method for processing the image
    def processImage(self):
        # Load the image
        image = cv2.imread(self.image)
        if image is None:
            raise FileNotFoundError(f"Image not found at path: {self.image}")

        (h, w) = image.shape[:2]

        # Construct a blob from the image
        imageBlob = cv2.dnn.blobFromImage(cv2.resize(image, (300, 300)), 1.0, (300, 300),
                                          (104.0, 177.0, 123.0), swapRB=False, crop=False)

        # Applying openCV's deep learning face detector to localize
        # the faces in the input image
        self.detector.setInput(imageBlob)
        detections = self.detector.forward()

        # Return the processed image
        return (detections, image, w, h, imageBlob)

    # Creating a method for performing the face recognition
    def performFaceRecognition(self):
        # Getting the processed image
        (detections, image, w, h, imageBlob) = self.processImage()
        predName = "No face detected"
        proba = 0.0

        # Creating a loop to loop over the detections and make predictions on the image
        # Also extract the confidence associated with the predictions,
        # and filter out weak detections
        for i in range(0, detections.shape[2]):
            confidence = detections[0, 0, i, 2]
            if confidence > self.confidenceValue:
                # Compute the (x, y)-coordinates of the bounding box for the face
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype("int")

                # Extract the face ROI
                face = image[startY:endY, startX:endX]
                (fH, fW) = face.shape[:2]

                # Ensure the face width and height are sufficiently large
                if fW < 20 or fH < 20:
                    continue

                # Construct a blob for the face ROI, then pass the blob through
                # our face embedding model to obtain the 128-d quantification of the face
                faceBlob = cv2.dnn.blobFromImage(face, 1.0 / 255, (96, 96),
                                                 (0, 0, 0), swapRB=True, crop=False)
                self.embedder.setInput(faceBlob)
                vec = self.embedder.forward()

                # Perform classification to recognize the face
                prediction = self.recognizer.predict_proba(vec)[0]
                result = np.argmax(prediction)
                proba = prediction[result]
                name = self.le.classes_[result]

                # Draw the bounding box of the face along with the associated probability
                predName = "{}: {:.2f}%".format(name, proba * 100)
                y = startY - 10 if startY - 10 > 10 else startY + 10
                cv2.rectangle(image, (startX, startY), (endX, endY), (0, 0, 255), 4)
                cv2.putText(image, predName, (startX, y), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 2)
                
                return (image, predName, proba)

        # Return the image
        return (image, predName, proba)


