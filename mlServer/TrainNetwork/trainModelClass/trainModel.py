# Importing the necessary modules 
import os
import cv2
import pickle
import imutils
import numpy as np
from imutils import paths 
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder

# Setting the path to the various models and weight
# Setting the path to the model 
trainDataset = "dataset" 
modelPath = "models" 

# output path 
outputPath = os.path.join(modelPath, 'output')

# Defining a class to train the machine learning model 
class TrainModelClass:
    def __init__(self, labels):
        # Load the necessary weight file and dataset directory 
        self.labels = labels 
        self.embeddings = os.path.sep.join([modelPath, 'embeddings.pickle'])
        self.detectorModel = os.path.sep.join([modelPath, 'faceDetectionModel'])
        self.embeddingModel = os.path.sep.join([modelPath, 'embeddingModel.t7'])
        self.recognizeModel = os.path.sep.join([modelPath, 'output/recognizer.pickle'])
        self.labelModel = os.path.sep.join([modelPath, 'output/le.pickle'])

        # Setting the confidence value 
        self.confidenceValue = 0.6 

    # Creating a method to load the model from disk 
    def loadModelFromDisk(self): 
        # loading the model from disk 
        protoPath = os.path.sep.join([self.detectorModel, 'deploy.prototxt'])
        modelPathFile = os.path.sep.join([self.detectorModel, 'res10.caffemodel'])

        # Getting the detector 
        detector = cv2.dnn.readNetFromCaffe(protoPath, modelPathFile)

        # Loading the serialized face embedding model from disk 
        embedder = cv2.dnn.readNetFromTorch(self.embeddingModel) 

        # Specifying the path to the images dataset 
        imagePaths = list(paths.list_images(trainDataset))

        # Initialize the list of extracted facial embeddings that co-responds to the 
        # people names 
        knownEmbeddings = []
        knownNames = []

        # Initialize the total number of faces processed 
        total = 0 

        try:
            # Creating a loop to loop through the images in the path specified 
            # loading the image, resizing it to have a width of 600 pixels and then 
            # grab the image dimensions, construct a blob from the image, and apply 
            # opencv deep learning face detector to localize the face and ensure that 
            # at least one face was found. 
            for (i, imagePaths) in enumerate(imagePaths): 
                # Getting the name 
                name = imagePaths.split(os.path.sep)[-2].lower()

                # Reading the images 
                image = cv2.imread(imagePaths)
                image = imutils.resize(image, width=600)
                (h, w) = image.shape[:2]

                # Getting the image blob 
                imageBlob = cv2.dnn.blobFromImage(cv2.resize(image, (300, 300)), 
                                    1.0, (300, 300), (104.0, 177.0, 123.0), swapRB=False, 
                                    crop=False)
                
                # Getting the detector 
                detector.setInput(imageBlob)
                detections = detector.forward() 

                # if the length of the detector is greate than zero 
                if len(detections) > 0: 
                    i = np.argmax(detections[0, 0, :, 2])
                    confidence = detections[0, 0, i, 2]

                    # Ensure that the detections with the larges probability 
                    # also mets our minimum test, thus filtering off weak detections 
                    if confidence >= self.confidenceValue: 
                        # get the bounding boxes 
                        box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                        (startX, startY, endX, endY) = box.astype('int')

                        # Extract the face ROI and grab the ROI dimensions 
                        face = image[startX:endY, startX:endX]
                        (fH, fW) = face.shape[:2]

                        # Ensure that the face width and height are sufficiently 
                        # large 
                        if fW < 20 or fH < 20: 
                            continue 

                        # Construct a blob for the face ROI, then pass the blob through 
                        # our face embedding to obtain the 128-d dimensions of the face 
                        faceBlob = cv2.dnn.blobFromImage(face, 1.0 / 255, 
                                                        (96, 96), (0, 0, 0), 
                                                        swapRB=True, crop=False)
                        
                        # Getting the embedding 
                        embedder.setInput(faceBlob)
                        vec = embedder.forward() 

                        # Adding the name of the person + corresponding face embedding 
                        # to their respective lists 
                        knownNames.append(name)
                        knownEmbeddings.append(vec.flatten())

                        # increment the total values 
                        total += 1 
                
            # Dumping the facial embedding and names to disk 
            print(f"[INFO]: Serialized {total} Encodings")
            data = {"embeddings": knownEmbeddings, "names": knownNames}

            # Opening the embeddings file and saving the values to it. 
            f = open(self.embeddings, "wb")
            f.write(pickle.dumps(data))
            f.close() 

            # Training the FR model 
            data = pickle.loads(open(self.embeddings, 'rb').read())
            
            # Encoding the labels  
            encoder = LabelEncoder() 
            labels = encoder.fit_transform(data["names"])

            # Building and fitting the model using SVC classifier 
            model = SVC(C=1.0, kernel="linear", probability=True)
            model.fit(data["embeddings"], labels) 

            # Writing the actual face recognition model to disk 
            f = open(self.recognizeModel, 'wb')
            f.write(pickle.dumps(model))
            f.close() 

            # Writing the label encoder to disk 
            f = open(self.labelModel, 'wb')
            f.write(pickle.dumps(encoder))
            f.close() 

            # Setting the message 
            message = "Successful training"
            status = "success" 

            # return success 
            return (message, status) 

        # On exeception return the error
        except Exception as error:
            # Execute the block of code below 
            message = error 
            status = "error"

            # Setting the error message 
            errorMessage = (message, status) 

            # Returning the error message 
            return errorMessage

        


