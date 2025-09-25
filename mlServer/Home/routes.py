#!/usr/bin/env python3

# Author: Engr Mbonu Chinedum 
# Date Created: 21/09/2025 
# Date Modified: 22/09/2025 

# This is a self-contained Flask blueprint for media analysis.
# The video analysis has been updated to serve processed files
# via an HTTP route instead of sending them over a WebSocket.

# importing the necessary modules
import cv2
import os
import base64
import jwt 
from flask_socketio import emit
from extensions import socketio
from datetime import datetime
from Database.mongo import MongoDB
from werkzeug.utils import secure_filename
from .imageClass.imageAnalysis import ImageModelClass
from .videoClass.videoAnalysis import VideoModelClass
from flask import Blueprint, jsonify, request, send_from_directory

# Paths for demonstration
tempDir = "tempFiles"

# Creating an instance of the database 
db = MongoDB() 

# Ensuring the temp directory exists 
os.makedirs(tempDir, exist_ok=True)

# Setting the blue print configuration
home = Blueprint("home", __name__)

# Setting the home routes
@home.route("/", methods=["GET"])
def homePage():
    return jsonify({"message": "Machine Learning Server...", "statusCode": 200})

# Setting the media path routes 
@home.route('/media/<path:filename>')
def serveMedia(filename):
    """Serve processed media files from the temporary directory."""
    return send_from_directory(tempDir, filename)

# Setting the home route for uploading the video 
@home.route('/uploadVideo', methods=['POST'])
def uploadVideo():
    """Handle video file uploads via HTTP POST."""
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400

    # Getting the uploaded file from the request body 
    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400

    # if the file exist, execute the block of code below 
    if file:
        # Getting the filename 
        filename = secure_filename(file.filename)

        # Add a timestamp to the filename to make it unique
        uniqueFilename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{filename}"
        filePath = os.path.join(tempDir, uniqueFilename)

        # Saving the file to disk 
        file.save(filePath)
        return jsonify({"message": "File uploaded successfully", "fileName": uniqueFilename})
    
    # On errors generated, return the block of code below. 
    return jsonify({"message": "An error occurred during upload"}), 500

# ------------------------------
# IMAGE analysis
# ------------------------------
def analyzeImageTask(sid, fileData, fileName, token):
    try:
        # CORRECTED: Changed tempFiles to tempDir
        imagePath = os.path.join(tempDir, f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{fileName}")

        # Decoding the token 
        decodedToken = jwt.decode(token, options={"verify_signature": False})

        # Getting the email address 
        emailAddress = decodedToken["email"]

        # CORRECTED: Changed tempFiles to tempDir
        saveImagePath = os.path.join(tempDir, f"processed_{datetime.now().strftime('%Y%m%d%H%M%S')}_{fileName}")

        base64Data = fileData.split(",")[1] if "," in fileData else fileData
        imageBytes = base64.b64decode(base64Data)

        with open(imagePath, "wb") as f:
            f.write(imageBytes)

        # Emit progress with a type identifier
        socketio.emit("progress", {"data": 25, "type": "image"}, room=sid)

        objectDetection = ImageModelClass(image=imagePath)
        (image, predName, proba) = objectDetection.performFaceRecognition()

        # Check if 'person' is found in the list of detected classes
        if (predName): 
            socketio.emit("detectionEvent", {"message": f"{predName} Detected.", "type": "image"}, room=sid)

        socketio.emit("progress", {"data": 70, "type": "image"}, room=sid)

        # Saving the analyzed image to disk 
        cv2.imwrite(saveImagePath, image)

        with open(saveImagePath, "rb") as imgFile:
            encodedString = base64.b64encode(imgFile.read()).decode("utf-8")

        socketio.emit("progress", {"data": 100, "type": "image"}, room=sid)

        socketio.emit("analysisComplete", {
            "type": "image",
            "resultUrl": f"data:image/jpeg;base64,{encodedString}"
        }, room=sid)

        # Saving the image url, and prediction to mongodb database
        # Connect to the mongoDB database 
        db.connect('mongodb://localhost:27017/', 'findLostFaces') 

        # Saving the analyzed imagepath, and the dataanalyzed 
        data = {
            "emailAddress": emailAddress, 
            "predictedLabel": predName, 
            "proba": proba, 
            "imageUrl": f"data:image/jpeg;base64,{encodedString}", 
            "type": "image"
        }

        # Save the data on the database 
        result = db.saveImageAnalysis('imagesHistory', data)

    # On exception as error, execute the block 
    # of code below 
    except Exception as e:
        socketio.emit("analysisError", {"message": str(e)}, room=sid)


@socketio.on("analyzeImage")
def handleAnalyzeImage(data):
    socketio.start_background_task(
        analyzeImageTask, 
        request.sid, data.get("fileData"), 
        data.get("fileName"), data.get('token'))


# ------------------------------
# VIDEO analysis
# ------------------------------
def analyzeVideoTask(sid, fileName, token):
    # Using try except block to get the video for analysis
    try:
        # getting the video path 
        videoPath = os.path.join(tempDir, fileName)

        # Decoding the token values 
        decodedToken = jwt.decode(token, options={"verify_signature": False})

        # Getting the email address 
        emailAddress = decodedToken['email']
        
        # Emitting a progress bar 
        socketio.emit("progress", {"data": 1, "type": "video"}, room=sid)

        # Reading the video into memory using opencv modules 
        cap = cv2.VideoCapture(videoPath)

        # fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        fourcc = cv2.VideoWriter_fourcc(*'avc1')
        
        # Create a unique filename for the processed video
        processedFileName = f"processed_{datetime.now().strftime('%Y%m%d%H%M%S')}_{os.path.basename(videoPath)}"
        saveVideoPath = os.path.join(tempDir, processedFileName)

        # Setting a video format to save the analyzed video 
        out = cv2.VideoWriter(
            saveVideoPath, fourcc, 20.0,
            (int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)),
             int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)))
        )

        # Getting the total frames inside the video, and setting 
        # the processed frames to start counting from zero 
        frameCount = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        processedFrames = 0

        # While the cap is opened, read the frames from the video 
        while cap.isOpened():
            # Read the frames, and break once completed. 
            ret, frame = cap.read()
            if not ret:
                break

            # Run ML model on each frame
            objectDetection = VideoModelClass(image=frame)
            (processedFrame, predName, proba) = objectDetection.performFaceRecognition()
            out.write(processedFrame)
            
            # Check if 'person' is found in the list of detected classes
            if (predName): 
                # Display to the user person's detected in the image. 
                socketio.emit("detectionEvent", {"message": f"{predName}", "type": "video"}, room=sid)

            # increment the processed frames 
            processedFrames += 1

            # Get the progress count in percentage 
            progress = (processedFrames / frameCount) * 100

            # Throttle updates (every 10 frames)
            if processedFrames % 10 == 0 or processedFrames == frameCount:
                socketio.emit("progress", {"data": progress, "type": "video"}, room=sid)
        
        # Release resources
        cap.release()
        out.release()
        
        # Send the URL to the frontend instead of the base64 string
        videoUrl = f"http://127.0.0.1:3001/media/{processedFileName}"
        
        # emitting the analysis complete 
        socketio.emit("analysisComplete", {
            "type": "video",
            "resultUrl": videoUrl
        }, room=sid)

        # Connecting to the database 
        print("[INFO]: Connecting to database...")
 
        # Saving the image url, and prediction to mongodb database
        # Connect to the mongoDB database 
        db.connect('mongodb://localhost:27017/', 'findLostFaces') 

        # Saving the analysis to the database 
        data = {
            "emailAddress": emailAddress, 
            "predictedLabel": predName, 
            "proba": proba, 
            "videoUrl": videoUrl, 
            "type": "video"
        }

        # Save the data on the database 
        result = db.saveVideoAnalysis('videoHistory', data)
        
        # Cleanup temporary files
        # os.remove(videoPath)

    # On exception as error, execute the following code below     
    except Exception as e:
        # Emitting the analysis error 
        socketio.emit("analysisError", {"message": str(e)}, room=sid)

# Start the video analysis 
@socketio.on("startVideoAnalysis")
def handleStartVideoAnalysis(data):
    socketio.start_background_task(
        analyzeVideoTask, 
        request.sid, 
        data.get("fileName"), data.get('token'))





