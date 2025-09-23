#!/usr/bin/env python3 

# Author: Engr Mbonu Chinedum 
# Date Created: 23/09/2025 
# Date Modified: 22/09/2025

# Importing the necessary modules 
import os 
import logging 
from flask import Flask, session 
from flask_cors import CORS 
from flask_socketio import SocketIO, emit 
from datetime import timedelta 
from dotenv import load_dotenv 
from extensions import socketio

# Loading the environment variables 
load_dotenv() 

# Creating the flask application 
app = Flask(__name__, static_folder=None, template_folder=None) 
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.secret_key = os.getenv('SECRET_KEY')
app.permanent_session_lifetime = timedelta(days=24)

# Setting the cors configurations 
CORS(app, 
    origins="http://localhost:3000", 
    methods=["POST", "GET", "PUT", "DELETE"], 
    allow_headers=[
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Access-Control-Allow-Methods', 
        'access-control-allow-orign', 
        'Access-Control-Allow-Origin', 
        'Access-Control-Allow-Headers',
        'Authorization',
        'Cache-Control', 
        'token'
    ]) 

# Using socket io 
# socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")
socketio.init_app(app, cors_allowed_origins="http://localhost:3000")

# Importing the views 
from Home.routes import home
from History.routes import history
from TrainNetwork.routes import trainNetwork

# Register the views using app.register method 
app.register_blueprint(home, url_prefix="/")
app.register_blueprint(history, url_prefix="/history")
app.register_blueprint(trainNetwork, url_prefix="/trainModel")  

# Setting the path to the logs 
logsDir = os.path.sep.join(['logs', 'requests.log']) 

# Logging the configurations to a file on disk
logging.basicConfig(filename=logsDir, level=logging.DEBUG,
                    format="%(asctime)s %(message)s %(filename)s %(module)s %(pathname)s",
                    datefmt="%m/%d/%Y %I:%M:%S %p")

# Socket variable
app.config["SOCKET_VARIABLE"] = socketio

# Running the main flask application 
if __name__ == "__main__": 
	# app.run(port=3001, host="0.0.0.0", debug=True) 
	# app.run() 
    # Using socket.run() insted of app.run() 
    socketio.run(app, port=3001, host="0.0.0.0", debug=True)