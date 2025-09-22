#!/usr/bin/env python3 

# Author: Engr Mbonu Chinedum 
# Date Created: 23/09/2025 
# Date Modified: 22/09/2025 

# This is a self-contined Flask blueprint for servering the 
# history data of the analyzed video and images. 

# Importing the necessary modules 
import os 
import cv2 
import base64 
from datetime import datetime 
from flask import Blueprint, request

# Path to load the history files 
tempDir = "tempFile" 

# Ensuring the temp direcory exists 
os.makedirs(tempDir, exist_ok=True)

# Setting the blueprint 
history = Blueprint("history", __name__)

# Setting the history route 
@history.route("/", methods=["GET", "POST"])
def homePage(): 
    pass 