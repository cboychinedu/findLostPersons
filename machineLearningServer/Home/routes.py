#!/usr/bin/env python3 

# Importing the necessary modules 
import os 
import sqlite3 
from flask import request, Blueprint, session, jsonify 

# Setting the path to the database 
databasePath = os.sep.join(['Database', 'database.db'])

# Connecting to the database 
# conn = sqlite3.connect(databasePath, check_same_thread=False)

# Creating the blueprint object 
home = Blueprint('home', 
				__name__,
				template_folder="template", 
				static_folder="static")

# Creating the home page 
@home.route("/", methods=["GET", "POST"])
def homePage(): 
	# Checking if the user is logged in 
	return jsonify({
		"message": "Hello", 
		"statusCode": 200
		})

# Creating a route for analyzing the video frames 
@home.route("/analyzeVideo", methods=["POST"])
def analyzeVideo(): 
	pass 


# Creating a route for analyzing the image frames 
@home.route("/analyzeImage", methods=["POST"])
def analyzeImage(): 
	pass 