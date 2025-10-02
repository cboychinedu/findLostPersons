#!/usr/bin/env python3

# Author: Engr Mbonu Chinedum 
# Date Created: 21/09/2025 
# Date Modified: 22/09/2025 

# This is a self-contained Flask blueprint for media analysis.
# The video analysis has been updated to serve processed files
# via an HTTP route instead of sending them over a WebSocket.

# Importing the necessary modules
import cv2
import os
import base64
import jwt 
from flask import Flask
from flask_socketio import emit
from extensions import socketio
from datetime import datetime
from Database.mongo import MongoDB
from werkzeug.utils import secure_filename
from bson.objectid import ObjectId
from .imageClass.imageAnalysis import ImageModelClass
from .videoClass.videoAnalysis import VideoModelClass
from flask import Blueprint, jsonify, request, send_from_directory

# Define the temporary directory for storing uploaded and processed files
tempDir = "tempFiles"

# Create a MongoDB database instance
db = MongoDB() 

# Create a Flask application instance
app = Flask(__name__)

# Ensure the temporary directory exists, create if missing
os.makedirs(tempDir, exist_ok=True)

# Create a Flask blueprint named "home"
home = Blueprint("home", __name__)

# Route for the homepage
@home.route("/", methods=["GET"])
def homePage():
    # Return a JSON response indicating the server is running
    return jsonify({"message": "Machine Learning Server...", "statusCode": 200})


# Route for serving processed media files
@home.route('/media/<path:filename>')
def serveMedia(filename):
    # Return the requested file from the temp directory
    return send_from_directory(tempDir, filename)


# Route for handling video uploads
@home.route('/uploadVideo', methods=['POST'])
def uploadVideo():
    # If no file is part of the request, return error
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400

    # Get the uploaded file
    file = request.files['file']
    # If the filename is empty, return error
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400

    # If a file was provided
    if file:
        # Sanitize filename
        filename = secure_filename(file.filename)
        # Append timestamp to make the filename unique
        uniqueFilename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{filename}"
        # Create full file path in temp directory
        filePath = os.path.join(tempDir, uniqueFilename)
        # Save the file
        file.save(filePath)
        # Return success message with new filename
        return jsonify({"message": "File uploaded successfully", "fileName": uniqueFilename})

    # If something goes wrong, return error
    return jsonify({"message": "An error occurred during upload"}), 500


# ------------------------------
# IMAGE ANALYSIS
# ------------------------------
# Function to analyze an image asynchronously
def analyzeImageTask(sid, fileData, fileName, token, modelId):
    # Using app_context to ensure Flask context is available
    with app.app_context():
        # Using try block to catch exceptions
        try:
            # Connect to MongoDB database
            db.connect('mongodb://localhost:27017/', 'findLostFaces')

            # Create path for temporarily saving the uploaded image
            imagePath = os.path.join(tempDir, f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{fileName}")

            # Decode JWT token to extract user data
            decodedToken = jwt.decode(token, options={"verify_signature": False})

            # Get user email address from token
            emailAddress = decodedToken["email"]

            # Checking to see if the user email is on the database 
            result = db.userInformation('users', emailAddress)

            # if the result is None, execute the block of code below
            if result is None:
                # Sending the error message to the client
                socketio.emit("analysisError", {"message": "User not found"}, room=sid)
                return

            # Create path for saving processed image
            saveImagePath = os.path.join(tempDir, f"processed_{datetime.now().strftime('%Y%m%d%H%M%S')}_{fileName}")

            # Extract base64 string from the file data
            base64Data = fileData.split(",")[1] if "," in fileData else fileData
            
            # Decode base64 string into bytes
            imageBytes = base64.b64decode(base64Data)

            # Save the uploaded image to disk
            with open(imagePath, "wb") as f:
                f.write(imageBytes)

            # Emit progress update
            socketio.emit("progress", {"data": 25, "type": "image"}, room=sid) 

            # Perform face recognition on the image
            objectDetection = ImageModelClass(image=imagePath, modelId=modelId)
            (image, predName, proba) = objectDetection.performFaceRecognition()

            # Check if no faces, proba, or image were detected 
            if (predName is None) or (proba is None) or (image is None): 
                socketio.emit("analysisError", {
                    "type": "image",
                    "message": "No faces detected in the uploaded image."
                }, to=sid)
                return

            # If a face is detected, notify the client
            if predName: 
                socketio.emit("detectionEvent", {"message": f"{predName} Detected.", "type": "image"}, room=sid)

            # Emit another progress update
            socketio.emit("progress", {"data": 70, "type": "image"}, room=sid)

            # Save processed image to disk
            cv2.imwrite(saveImagePath, image)

            # Encode processed image as base64 string
            with open(saveImagePath, "rb") as imgFile:
                encodedString = base64.b64encode(imgFile.read()).decode("utf-8")

            # Emit final progress update
            socketio.emit("progress", {"data": 100, "type": "image"}, room=sid)

            # Send analysis complete event with base64 result
            socketio.emit("analysisComplete", {
                "type": "image",
                "resultUrl": f"data:image/jpeg;base64,{encodedString}"
            }, room=sid)
    
            # Prepare data to save
            data = {
                "emailAddress": emailAddress, 
                "predictedLabel": predName, 
                "proba": proba, 
                "imageUrl": f"data:image/jpeg;base64,{encodedString}", 
                "type": "image"
            }

            # Save analysis result in database
            db.saveImageAnalysis('imagesHistory', data)

        # Catch any exceptions and emit error event
        except Exception as e:
            # Emit error event to client
            socketio.emit("analysisError", {"message": "Select a machine learning model..."}, room=sid)



# Event listener for image analysis
@socketio.on("analyzeImage")
def handleAnalyzeImage(data):
    # Start background task for image analysis
    socketio.start_background_task(
        analyzeImageTask, 
        request.sid,
        data.get("fileData"), 
        data.get("fileName"), 
        data.get('token'), 
        data.get("modelId")
    )


# ------------------------------
# VIDEO ANALYSIS
# ------------------------------
# Function to analyze a video asynchronously
def analyzeVideoTask(sid, fileName, token, modelId):
    # Using app_context to ensure Flask context is available
    with app.app_context():
        # Using try block to catch exceptions
        try:
            # Get the uploaded video path
            videoPath = os.path.join(tempDir, fileName)
            
            # Decode JWT token
            decodedToken = jwt.decode(token, options={"verify_signature": False})
            
            # Get user email address
            emailAddress = decodedToken['email']

            # Connect to MongoDB
            db.connect('mongodb://localhost:27017/', 'findLostFaces')

            # Checking to see if the user email is on the database 
            result = db.userInformation('users', emailAddress) 

            # if the result is None, execute the block of code below
            if result is None:
                # Sending the error message to the client
                socketio.emit("analysisError", {"message": "User not found"}, room=sid)
                return
            
            # Emit initial progress
            socketio.emit("progress", {"data": 1, "type": "video"}, room=sid)

            # Open video using OpenCV
            cap = cv2.VideoCapture(videoPath)
            
            # Define video codec
            fourcc = cv2.VideoWriter_fourcc(*'avc1')
            
            # Create unique filename for processed video
            processedFileName = f"processed_{datetime.now().strftime('%Y%m%d%H%M%S')}_{os.path.basename(videoPath)}"
           
            # Create save path for processed video
            saveVideoPath = os.path.join(tempDir, processedFileName)

            # Create a video writer object
            out = cv2.VideoWriter(
                saveVideoPath, fourcc, 20.0,
                (int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)),
                int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)))
            )

            # Get total number of frames in video
            frameCount = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            
            # Initialize processed frame counter
            processedFrames = 0

            # Loop through video frames
            while cap.isOpened():
                # Read next frame
                ret, frame = cap.read()
                if not ret:
                    break

                # Perform face recognition on frame
                objectDetection = VideoModelClass(image=frame, modelId=modelId)
                (processedFrame, predName, proba) = objectDetection.performFaceRecognition()

                # Check if no faces were detected
                if (predName is None) or (proba is None) or (processedFrame is None): 
                    socketio.emit("analysisError", {
                        "type": "image",
                        "message": "No faces detected in the uploaded image."
                    }, to=sid)
                    return
                
                # Write processed frame to output video
                out.write(processedFrame)
                
                # If a face is detected, notify the client
                if predName: 
                    socketio.emit("detectionEvent", {"message": f"{predName}", "type": "video"}, room=sid)

                # Increment processed frames
                processedFrames += 1
                # Calculate progress percentage
                progress = (processedFrames / frameCount) * 100

                # Send progress update every 10 frames or at the end
                if processedFrames % 10 == 0 or processedFrames == frameCount:
                    socketio.emit("progress", {"data": progress, "type": "video"}, room=sid)
            
            # Release resources after processing
            cap.release()
            out.release()
            
            # Generate URL for processed video
            videoUrl = f"http://127.0.0.1:3001/media/{processedFileName}"
            
            # Send analysis complete event with video URL
            socketio.emit("analysisComplete", {
                "type": "video",
                "resultUrl": videoUrl
            }, room=sid)
 
            # Prepare data for saving
            data = {
                "emailAddress": emailAddress, 
                "predictedLabel": predName, 
                "proba": proba, 
                "videoUrl": videoUrl, 
                "type": "video"
            }

            # Save video analysis results in database
            db.saveVideoAnalysis('videoHistory', data)


        # Handle exceptions and emit error event
        except Exception as e:
            # Emit error event to client
            socketio.emit("analysisError", {"message": "Select a machine learning model..."}, room=sid)


# Event listener for video analysis
@socketio.on("startVideoAnalysis")
def handleStartVideoAnalysis(data):
    # Start background task for video analysis
    socketio.start_background_task(
        analyzeVideoTask, 
        request.sid,
        data.get("fileName"), 
        data.get('token'), 
        data.get("modelId")
    )
