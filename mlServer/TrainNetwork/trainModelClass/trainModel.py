# Importing the necessary modules 
import os
import cv2
import numpy as np 
from imutils import path 
from sklearn.svm import SVC 
from datetime import datetime
from sklearn.preprocessing import LabelEncoder

# Setting the path to the various models and weight 
trainDataset = "dataset" 


# Setting the path to the model 
modelPath = "models" 

# Defining a class to train the machine learning model 
class TrainModelClass:
    def __init__(self, imagePath, annotationPath):
        # Load the model 
        pass  
