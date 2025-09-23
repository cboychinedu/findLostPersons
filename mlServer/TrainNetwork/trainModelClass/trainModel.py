# Importing the necessary modules 
import os
import cv2
import logging 
import numpy as np 
import tensorflow as tf
from datetime import datetime

# Setting the path to the model 
modelPath = "savedModel" 

# Defining a class to train the machine learning model 
class TrainModelClass:
    def __init__(self, imagePath, annotationPath):
        # Load the model 
        self.model = tf.saved_model.load(modelPath)
        self.imagePath = imagePath
        self.annotationPath = annotationPath

    # Creating a method to load the data 
    def loadData(self): 
        # load the image 
        image = cv2.imread(self.imagePath) 
