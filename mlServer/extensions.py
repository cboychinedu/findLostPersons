# importing the necessary modules 
from flask_socketio import SocketIO

# Create the socketio instance 
socketio = SocketIO(cors_allowed_origins="http://localhost:3000")