#!/usr/bin/env python3

# Author: Engr Mbonu Chinedum 
# Date Created: 21/09/2025 
# Date Modified: 22/09/2025 

# importing the necessary modules
import os
import cv2
from Database.mongo import MongoDB
import numpy as np

# Setting the path to the model
modelPath = "models"

# Output path
outputPath = os.path.join(modelPath, 'output')

# Creating an instance of the database 
db = MongoDB() 

# Loading the models from mongoDB
def loadModelFromDB(modelId):
    # Connect to the database
    db.connect("mongodb://localhost:27017/", "findLostFaces")

    # Getting the model from the database
    (embeddings, recognizerModel, labelEncoder) = db.retriveASingleMachineLearningModel(modelId, 'models') 

    # return (pickle.loads(embeddings), pickle.loads(recognizerModel), pickle.loads(labelEncoder))
    return (embeddings, recognizerModel, labelEncoder)

    

# Defining a class to load the model
class ImageModelClass: # Class names use PascalCase
    def __init__(self, image, modelId): # method parameters use camelCase
        self.image = image
        self.detectorModel = os.path.join(modelPath, "faceDetectionModel")
        self.embeddingModel = os.path.join(modelPath, "embeddingModel.t7")
        # self.recognizerModel = os.path.join(outputPath, "recognizer.pickle")
        # self.labelModel = os.path.join(outputPath, "le.pickle")

        # Load model from database if modelData is provided
        (self.embeddings, self.recognizer, self.le) = loadModelFromDB(modelId=modelId)

        # Loading the serialized face detector model into memory
        self.confidenceValue = 0.6
        self.protoPath = os.path.join(self.detectorModel, 'deploy.prototxt')
        self.modelPath = os.path.join(self.detectorModel, 'res10.caffemodel')
        self.detector = cv2.dnn.readNetFromCaffe(self.protoPath, self.modelPath)

        # Loading the serialized face embedding model into memory
        self.embedder = cv2.dnn.readNetFromTorch(self.embeddingModel)

        # Correcting the way the pickle files are loaded
        # self.recognizer = pickle.load(open(self.recognizerModel, "rb"))
        # self.le = pickle.load(open(self.labelModel, "rb"))

    # Creating a method for processing the image
    def processImage(self): 
        # Load the image
        image = cv2.imread(self.image)
        if image is None:
            raise FileNotFoundError(f"Image not found at path: {self.image}")

        (height, width) = image.shape[:2] # Renamed h and w to full names

        # Construct a blob from the image
        imageBlob = cv2.dnn.blobFromImage(cv2.resize(image, (300, 300)), 1.0, (300, 300),
                                          (104.0, 177.0, 123.0), swapRB=False, crop=False)

        # Applying openCV's deep learning face detector to localize
        # the faces in the input image
        self.detector.setInput(imageBlob)
        detections = self.detector.forward()

        # Return the processed image
        return (detections, image, width, height, imageBlob) # Return width and height

    # Creating a method for performing the face recognition
    def performFaceRecognition(self): # method name uses camelCase
        # Getting the processed image
        (detections, image, width, height, imageBlob) = self.processImage() # Use camelCase variables
        predName = "No face detected" # local variable uses camelCase
        proba = 0.0

        # Creating a loop to loop over the detections and make predictions on the image
        for i in range(0, detections.shape[2]):
            confidence = detections[0, 0, i, 2]
            if confidence > self.confidenceValue:
                # Compute the (x, y)-coordinates of the bounding box for the face
                box = detections[0, 0, i, 3:7] * np.array([width, height, width, height])
                (startX, startY, endX, endY) = box.astype("int")

                # Extract the face ROI
                face = image[startY:endY, startX:endX]
                (fH, fW) = face.shape[:2]

                # Ensure the face width and height are sufficiently large
                if fW < 20 or fH < 20:
                    continue

                # Construct a blob for the face ROI, then pass the blob through
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
                
                # return (image, predName, proba)

        # Return the image
        return (image, predName, proba)