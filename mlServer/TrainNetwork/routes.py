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

# Setting the blue print configuration 
trainNetwork = Blueprint("trainNetwork", __name__)

# Setting the train network routes 
@trainNetwork.route("/", methods=["POST"])
def trainModel():
    # Handle model training via HTTP POST 
    # The if statement is redundant since the route is already restricted to POST
    if request.method == "POST":
        # Access the uploaded zip file 
        try:
            # Access the uploaded zip file 
            if ("zipImageFile" not in request.files): 
                return jsonify({
                    "status": "error", 
                    "message": "No zip file uploaded.", 
                    "statusCode": 400 
                })
            
            # Getting the zip files 
            zipImageFile = request.files["zipImageFile"]
            label = request.files["labels"] 

            # Saving giving the files a unique name using timestamp  
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            
            # Define directories
            uploadsDir = "uploads"
            datasetDir = "dataset"
            
            # Ensure the uploads and dataset directories exist on the server
            os.makedirs(uploadsDir, exist_ok=True)
            os.makedirs(datasetDir, exist_ok=True) 

            # Define file paths
            zipFile = os.path.join(uploadsDir, f"zip_{timestamp}.zip")
            labelFile = os.path.join(uploadsDir, f"label_{timestamp}.txt")
            
            # Saving the files to the server
            zipImageFile.save(zipFile)
            label.save(labelFile)

            with zipfile.ZipFile(zipFile, 'r') as zipref:
                zipref.extractall(os.path.join(datasetDir, f"{timestamp}"))

            # Return a success message if the unzipping is successful
            return jsonify({
                "status": "success", 
                "message": "Files uploaded and unzipped successfully.",
                "statusCode": 200
            }), 200

        except Exception as error: 
            print(f"[ERROR]: An error occurred during training - {str(error)}")
            
            # Exception error message to the client 
            return jsonify({
                "status": "error", 
                "message": error, 
                "statusCode": 500
            })