#!/usr/bin/env python3 

# Author: Engr Mbonu Chinedum 
# Date Created: 23/09/2025 
# Date Modified: 22/09/2025 

# This is a self-contined Flask blueprint for servering the 
# history data of the analyzed video and images. 

# Importing the necessary modules 
import os   
from Database.mongo import MongoDB
from flask import Blueprint 

# Creating an instance of the database 
db = MongoDB()

# Connecting to the mongodb database 
db.connect('mongodb://localhost:27017/', 'findLostFaces')

# Setting the blueprint 
history = Blueprint("history", __name__)

# Setting the analyzed image history route 
@history.route("/analyzedImageHistory", methods=["POST"])
def analyzedImageHistory(): 
    pass 

# Setting the analyzed video history routes 
@history.route("/analyzedVideoHistory", methods=["POST"])
def analyzedVideoHistory(): 
    pass 