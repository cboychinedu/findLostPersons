#!/bin/bash

# Starting the programs for finding the lost persons 
echo "Hello, welcome to the Find Lost Persons project!"

# Start backend
echo "Starting backend..."
cd backend/ 
pm2 start dist/app.js --name "backendApp" 

# Change to the project directory 
cd ../ 

# Start ML server
echo "Starting Machine learning server..."
cd mlServer/

# Activating the ml environment 
conda activate ml 

# Starting the machine learing applications 
pm2 start "app.py" --name "mlServerApp" --interpreter=python

# Change to the project directory 
cd ../

# Start ReactJS frontend
echo "Starting ReactJS frontend..."
cd myapp/ 

# Building the app 
npm run build 

# Starting the web application 
pm2 serve build/ 3000 --name "frontendApp" --spa

# All services started 
echo "All services started."; 