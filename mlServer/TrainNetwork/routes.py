#!/usr/bin/env python3 

# Author: Engr Mbonu Chinedum 
# Date Created: 23/09/2025 
# Date Modified: 23/09/2025

# This is a self-contained Flask blueprint for training neural networks.
# It provides an HTTP route to initiate training and returns the training status.

# importing the necessary modules
import os 
import cv2 
from datetime import datetime
from flask import Blueprint, jsonify, request

# Setting the blue print configuration 
trainNetwork = Blueprint("trainNetwork", __name__)

# Setting the train network routes 
@trainNetwork.route("/", methods=["POST"])
def trainModel():
    # Handle model training via HTTP POST 
    if request.method == "POST":
        # Getting the files from the request
        imageFile = request.files.get("image")
        annotationFile = request.files.get("annotation")

        # Validating the files if they do not exist 
        if not imageFile or not annotationFile:
            # Return the error message to the client 
            return jsonify({
                "status": "error", 
                "message": "Both image and annotation files are required.", 
                "statusCode": 400
            })
        
        # Saving giving the files a unique name using timestamp  
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        imagePath = os.path.join("uploads", f"image_{timestamp}.jpg")
        annotationPath = os.path.join("uploads", f"annotation_{timestamp}.txt")
        
        # Ensure the uploads directory exists on the server, if not, 
        # Create the directory 
        os.makedirs("uploads", exist_ok=True)

        # Saving the files to the server
        imageFile.save(imagePath)
        annotationFile.save(annotationPath)

        # Performing a mock training process
        try:
            # Here you would add your actual training logic
            # For demonstration, we will just read the image and annotation files
            image = cv2.imread(imagePath)

            # Reading the annotation file
            with open(annotationPath, 'r') as file:
                annotations = file.readlines()
            
            # Simulating training process
            # (In a real scenario, you would train your model here)
            print(f"[INFO]: Training model with image of shape {image.shape} and {len(annotations)} annotations.")

            # Returning a success message to the client 
            return jsonify({
                "status": "success", 
                "message": "Model training initiated successfully.", 
                "statusCode": 200
            })
        
        # Excetion handling 
        except Exception as e:
            print(f"[ERROR]: An error occurred during training - {str(e)}")
            
            # Exception error message to the client 
            return jsonify({
                "status": "error", 
                "message": "An error occurred during model training.", 
                "statusCode": 500
            })
