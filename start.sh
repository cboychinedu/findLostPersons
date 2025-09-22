#!/bin/bash

# Starting the programs for finding the lost persons 
echo "Hello, welcome to the Find Lost Persons project!"

# Start backend
echo "Starting backend..."
cd backend/ 
nohup npm start > backend.log 2>&1 &

# Change to the project directory 
cd ../ 

# Start ML server
echo "Starting Machine learning server..."
cd mlServer/
nohup python3 app.py > mlserver.log 2>&1 &

# Change to the project directory 
cd ../

# Start ReactJS frontend
echo "Starting ReactJS frontend..."
cd myapp/ 
nohup npm start > react.log 2>&1 &

# All services started 
echo "All services started."; 