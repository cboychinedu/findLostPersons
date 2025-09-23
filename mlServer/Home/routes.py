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
from flask_socketio import emit
from extensions import socketio
from datetime import datetime
from werkzeug.utils import secure_filename
from .imageClass.imageAnalysis import ImageModelClass
from .videoClass.videoAnalysis import VideoModelClass
from flask import Blueprint, jsonify, request, send_from_directory

# Paths for demonstration
tempDir = "tempFile"

# Ensuring the temp directory exists 
os.makedirs(tempDir, exist_ok=True)

# Setting the blue print configuration
home = Blueprint("home", __name__)

# Setting the home routes
@home.route("/", methods=["GET"])
def homePage():
    return jsonify({"message": "Home Route", "statusCode": 200})

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
def analyzeImageTask(sid, fileData, fileName):
    try:
        imagePath = os.path.join(tempDir, f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{fileName}")
        saveImagePath = os.path.join(tempDir, f"processed_{datetime.now().strftime('%Y%m%d%H%M%S')}_{fileName}")

        base64Data = fileData.split(",")[1] if "," in fileData else fileData
        imageBytes = base64.b64decode(base64Data)

        with open(imagePath, "wb") as f:
            f.write(imageBytes)

        # Emit progress with a type identifier
        socketio.emit("progress", {"data": 25, "type": "image"}, room=sid)

        objectDetection = ImageModelClass(image=imagePath)
        (processed, classNameList) = objectDetection.performObjectDetection()

        # Check if 'person' is found in the list of detected classes
        if ("person" in classNameList): 
            socketio.emit("detectionEvent", {"message": "Person detected in image", "type": "image"}, room=sid)

        socketio.emit("progress", {"data": 70, "type": "image"}, room=sid)

        cv2.imwrite(saveImagePath, processed)

        with open(saveImagePath, "rb") as imgFile:
            encodedString = base64.b64encode(imgFile.read()).decode("utf-8")

        socketio.emit("progress", {"data": 100, "type": "image"}, room=sid)

        socketio.emit("analysisComplete", {
            "type": "image",
            "resultUrl": f"data:image/jpeg;base64,{encodedString}"
        }, room=sid)

    except Exception as e:
        socketio.emit("analysisError", {"message": str(e)}, room=sid)


@socketio.on("analyzeImage")
def handleAnalyzeImage(data):
    socketio.start_background_task(analyzeImageTask, request.sid, data.get("fileData"), data.get("fileName"))


# ------------------------------
# VIDEO analysis
# ------------------------------
def analyzeVideoTask(sid, fileName):
    try:
        videoPath = os.path.join(tempDir, fileName)
        
        socketio.emit("progress", {"data": 1, "type": "video"}, room=sid)

        cap = cv2.VideoCapture(videoPath)
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        
        # Create a unique filename for the processed video
        processedFileName = f"processed_{datetime.now().strftime('%Y%m%d%H%M%S')}_{os.path.basename(videoPath)}"
        saveVideoPath = os.path.join(tempDir, processedFileName)

        out = cv2.VideoWriter(
            saveVideoPath, fourcc, 20.0,
            (int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)),
             int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)))
        )

        frameCount = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        processedFrames = 0

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            # Run ML model on each frame
            objectDetection = VideoModelClass(image=frame)
            (processedFrame, classNameList) = objectDetection.performObjectDetection()
            out.write(processedFrame)
            
            # Check if 'person' is found in the list of detected classes
            if ("person" in classNameList): 
                socketio.emit("detectionEvent", {"message": "Person detected in video", "type": "video"}, room=sid)

            processedFrames += 1
            progress = (processedFrames / frameCount) * 100

            # Throttle updates (every 10 frames)
            if processedFrames % 10 == 0 or processedFrames == frameCount:
                socketio.emit("progress", {"data": progress, "type": "video"}, room=sid)
        
        # Release resources
        cap.release()
        out.release()
        
        # Send the URL to the frontend instead of the base64 string
        videoUrl = f"http://127.0.0.1:3001/media/{processedFileName}"
        socketio.emit("analysisComplete", {
            "type": "video",
            "resultUrl": videoUrl
        }, room=sid)

        # Cleanup temporary files
        os.remove(videoPath)
        
    except Exception as e:
        socketio.emit("analysisError", {"message": str(e)}, room=sid)

@socketio.on("startVideoAnalysis")
def handleStartVideoAnalysis(data):
    socketio.start_background_task(analyzeVideoTask, request.sid, data.get("fileName"))
