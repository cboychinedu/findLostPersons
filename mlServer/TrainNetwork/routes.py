#!/usr/bin/env python3 

# Author: Engr Mbonu Chinedum 
# Date Created: 23/09/2025 
# Date Modified: 23/09/2025

# This is a self-contained Flask blueprint for training neural networks.
# It provides an HTTP route to initiate training and returns the training status.

# importing the necessary modules
import os
import zipfile  
from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from .trainModelClass.trainModel import TrainModelClass

# Setting the blue print configuration 
trainNetwork = Blueprint("trainNetwork", __name__)

# Defining the necessary directories
uploadsDir = "uploads"
datasetDir = "dataset"

@trainNetwork.route("/", methods=["GET"])
def homePage(): 
    return jsonify({"home": "home message"})

# Setting the train network routes 
@trainNetwork.route("/trainModel", methods=["POST"])
@cross_origin(origin="http://localhost:3000")
def trainModelFunction():
    # Handle model training via HTTP POST 
    # The if statement is redundant since the route is already restricted to POST
    if request.method == "POST":
        # Check if a file is present in the request 
        if "file" not in request.files: 
            return jsonify({"status": "error", "message": "No file part in the form"})
        
        # Access the uploaded zip file 
        try:
            # Getting the zip files 
            zipImageFile = request.files['file']
            labels = request.form.get("labels")

            # Saving giving the files a unique name using timestamp  
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            
            # Ensure the uploads and dataset directories exist on the server
            os.makedirs(uploadsDir, exist_ok=True)
            os.makedirs(datasetDir, exist_ok=True) 

            # Define file paths
            zipFile = os.path.join(uploadsDir, f"zip_{timestamp}.zip")
         
            # Saving the files to the server
            zipImageFile.save(zipFile)

            # Extracting the files into the dataset/labels directory 
            with zipfile.ZipFile(zipFile, 'r') as zipref:
                zipref.extractall(datasetDir)

            # Creating an instance of the trainclass 
            # Training the model
            trainmodel = TrainModelClass(labels=labels)

            # Training the model on the uploaded images in zip format 
            (message, status) = trainmodel.loadModelFromDisk() 

            # Checking the message and status 
            if (status == "error"): 
                # Return an error message 
                errorMessage = {
                    "status": status, 
                    "message": message, 
                    "statusCode": 404,
                }

                # return the message 
                return jsonify(errorMessage)
            
            # Else if the training was a success, 
            # Execute the block of code below. 
            else:
                # Else if the training was successful
                return jsonify({
                    "status": "success", 
                    "message": "Files sucessfully trained on the model.",
                    "statusCode": 200
                })














        # Unless exception as error 
        except Exception as error: 
            print(f"[ERROR]: An error occurred during training - {str(error)}")
            
            # Exception error message to the client 
            return jsonify({
                "status": "error", 
                "message": error, 
                "statusCode": 500
            })