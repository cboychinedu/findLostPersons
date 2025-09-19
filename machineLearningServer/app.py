#!/usr/bin/env python3 

# Importing the necessary modules 
import os 
import logging 
from flask import Flask, session 
from flask_cors import CORS 
from datetime import timedelta 
from dotenv import load_dotenv 

# Loading the environment variables 
load_dotenv() 

# Importing the views 
from Home.routes import home

# Creating the flask application 
app = Flask(__name__, static_folder=None, template_folder=None) 
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.secret_key = os.getenv('SECRET_KEY')
app.permanent_session_lifetime = timedelta(days=24)

# Setting the cors configurations 
CORS(app) 

# Register the views using app.register method 
app.register_blueprint(home, url_prefix="/")


# Running the main flask application 
if __name__ == "__main__": 
	app.run(port=5000, host="localhost", debug=True) 
	app.run() 