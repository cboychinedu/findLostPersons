#!/usr/bin/env python3 

# Importing the necessary modules 
import json 
from flask import jsonify
from pymongo import MongoClient 

# Creating a class for handling the database connections 
class MongoDB: 
    def __init__(self): 
        self.clinet = None 
        self.db = None 

    # Creating a method for connecting into the database 
    def connect(self, uri, dbName): 
        self.clinet = MongoClient(uri) 
        self.db = self.clinet[dbName]

    # Creating a method for saving the analyzed video 
    def saveVideoAnalysis(self, collectionName, data): 
        # Getting the collection object 
        collection = self.db[collectionName]

        # Saving the collection data 
        result = collection.insert_one(data)

        # Returning the result 
        return result.acknowledged 

    # Creating a method for saving the analyzed images or video 
    def saveImageAnalysis(self, collectionName, data): 
        # Getting the collection object 
        collection = self.db[collectionName]

        # Saving the collection data 
        result = collection.insert_one(data) 

        # Returning the result 
        return result.acknowledged
    
    # Creating a method for retriving the user's analyzed image 
    def retriveImageData(self, collectionName, email): 
        # Setting the query 
        query = {"emailAddress": email }

        # Getting the collection 
        collection = self.db[collectionName]

        # Find all the data for image analysis by the specified 
        # email address 
        data = collection.find(query, {
            "_id": 1, 
            "predictedLabel": 1, 
            "proba": 1, 
            "imageUrl": 1, 
            "type": 1 
        })

        # if the returned type is None type, execute the block 
        # of code below 
        if (data == None): 
            # Return the following 
            return jsonify({
                "status": "error", 
                "message": "Error fetching the image history data", 
                "statusCode": 404 
            })
        
        # Else if the history data for the image exists, 
        # Execute the block of code below 
        else: 
            # Convert the MongoDB documents into a json object 
            jsonData = json.dumps(list(data), default=str)
            jsonData = jsonify(json.loads(jsonData))

            # Return the json object 
            return jsonData 
        
    # Creating a method for retriving the video data 
    def retriveVideoData(self, collectionName, email):
        # Setting the query 
        query = { "emailAddress": email } 

        # Getting the collection 
        collection = self.db[collectionName]

        # Find all the data for the video analysis by the 
        # specified email address
        data = collection.find(query, {
            "_id": 1, 
            "predictedLabel": 1, 
            "proba": 1, 
            "videoUrl": 1, 
            "type": 1 
        })

        # if the returned type is None type, execute the 
        # block of code below 
        if (data == None): 
            # Return the following 
            return jsonify({
                "status": "error", 
                "message": "Error fetching the video history data", 
                "statusCode": 404 
            })
        
        # Else if the history data for the video file exists 
        # Execute the block of code below 
        else: 
            # Convert the mongodb documents into a json object 
            jsonData = json.dumps(list(data), default=str) 
            jsonData = jsonify(json.loads(jsonData))

            # Return the json object 
            return jsonData 

