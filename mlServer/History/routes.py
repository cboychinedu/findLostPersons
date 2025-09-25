#!/usr/bin/env python3 

# Author: Engr Mbonu Chinedum 
# Date Created: 23/09/2025 
# Date Modified: 22/09/2025 

# This is a self-contined Flask blueprint for servering the 
# history data of the analyzed video and images. 

# Importing the necessary modules 
import os   
import jwt 
from Database.mongo import MongoDB
from flask import Blueprint, request 

# Creating an instance of the database 
db = MongoDB()

# Setting the blueprint 
history = Blueprint("history", __name__)

# Setting the analyzed image history route 
@history.route("/analyzedImageHistory", methods=["POST"])
def analyzedImageHistory(): 
    # Getting the request headers 
    token = request.headers.get('xAuthtoken') 

    # Retrive the images data 
    # Connecting to the mongodb database 
    db.connect('mongodb://localhost:27017/', 'findLostFaces')

    # Decoding the token 
    decodedToken = jwt.decode(token, options={"verify_signature": False})

    # Retrive the images data 
    result = db.retriveImageData(collectionName='imagesHistory', email=decodedToken["email"])

    # returing the result 
    return result 

# Setting the analyzed video history routes 
@history.route("/analyzedVideoHistory", methods=["POST"])
def analyzedVideoHistory(): 
    # Getting the request headers 
    token = request.headers.get('xAuthtoken')

    # Retrive the video data 
    # Connecting to the mongodb database 
    db.connect('mongodb://localhost:27017/', 'findLostFaces')

    # Decoding the token 
    decodedToken = jwt.decode(token, options={"verify_signature": False})

    # Retrive the images data 
    result = db.retriveVideoData(collectionName='', email=decodedToken["email"])

    # Returning the result 
    return result 