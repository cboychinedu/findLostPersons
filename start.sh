#!/bin/bash

# Starting the programs for finding the lost persons 
echo "Hello, welcome to the Find Lost Persons project!"

# Listing to see if any process is runnin 
pm2 list 

# Start backend
echo "Starting backend..."
cd backend/ 
pm2 start dist/app.js --name "backend" 

# Change to the project directory 
cd ../ 

# Start ML server
echo "Starting Machine learning server..."
cd mlServer/

# Installing the required dep 
echo "Installing the required dep"
pip install -r requirements.txt 

# Starting the machine learing applications 
# Switching the environments 
echo "Switch environments" 
conda activate ml 

echo "Starting the python application" 
pm2 start "app.py" --name "mlServer" --interpreter=python

# Change to the project directory 
cd ../

# Start ReactJS frontend
echo "Starting ReactJS frontend..."
cd myapp/ 

# Building the app 
npm run build 

# Starting the web application 
pm2 serve build/ 3000 --name "frontend" --spa

# All services started 
echo "All services started."; 