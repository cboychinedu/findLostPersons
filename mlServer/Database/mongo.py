#!/usr/bin/env python3
# 
# Author: Engr Mbonu Chinedum 
# Date Created: 21/09/2025 
# Date Modified: 22/09/2025  

# Importing the necessary modules 
import json 
import pickle 
import datetime
from bson.objectid import ObjectId
from flask import jsonify
from pymongo import MongoClient 
from bson import json_util 


# Creating a class for handling the database connections 
class MongoDB: 
    def __init__(self): 
        self.clinet = None 
        self.db = None 

    # Creating a method for connecting into the database 
    def connect(self, uri, dbName): 
        self.clinet = MongoClient(uri) 
        self.db = self.clinet[dbName]

    # Creating a method for getting the user's information 
    def userInformation(self, collectionName, emailAddress): 
        # Setting the query 
        query = { 'emailAddress': emailAddress }
        collection = self.db[collectionName]

        # Find one data by the specified email address 
        data = collection.find_one(query, {
            "_id": 1, 
            "fullname": 1, 
            "emailAddress": 1,
        }); 

        # if the returned type is a None type, execute the block 
        # of code below 
        if data == None: 
            # return None as a data type 
            return None; 

        # Convert the MongoDB documents into a json object 
        json_data = json.dumps(dict(data), default=str)
        json_data = jsonify(json_data); 

        # Return the json object 
        return json_data;

    # Get the currect time 
    def getCurrentTime(self): 
        # Generates the current time in a universally accepted
        # Standardized format (ISO 8601)
        nowUtc = datetime.datetime.utcnow()

        # Format it into an ISO 8601 string, suitable for JSON/BSON 
        return nowUtc.isoformat() 
    
    # Creating a method for saving the trained machine learing 
    # model into the mongodb database 
    def saveMachineLearningModel(self, collectionName, data):
        # Getting the collection object 
        collection = self.db[collectionName]

        # Saving the collection data 
        result = collection.insert_one(data)
        
        # Returning the result 
        return result

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
        data = list(collection.find(query, {
            "_id": 1, 
            "predictedLabel": 1, 
            "proba": 1, 
            "imageUrl": 1, 
            "type": 1 
        })) # Convert Cursor to list immediately

        # The check for 'data == None' is not needed since find() returns a Cursor 
        # and list(Cursor) returns an empty list if no results are found.
        if not data: 
            return jsonify({
                "status": "error", 
                "message": "Error fetching the image history data", 
                "statusCode": 404 
            })
        
        # --- CORRECTION 1: Use json.dumps with json_util.default ---
        # This converts the list of Python dictionaries (including ObjectId) 
        # to a JSON string. Then use Flask's response object.
        jsonString = json.dumps(data, default=json_util.default)
        return jsonString
        
    # Creating a method for retriving the video data 
    def retriveVideoData(self, collectionName, email):
        # Setting the query 
        query = { "emailAddress": email } 

        # Getting the collection 
        collection = self.db[collectionName]

        # Find all the data for the video analysis by the 
        # specified email address
        data = list(collection.find(query, {
            "_id": 1, 
            "predictedLabel": 1, 
            "proba": 1, 
            "videoUrl": 1, 
            "type": 1 
        }))

        if not data: 
            return jsonify({
                "status": "error", 
                "message": "Error fetching the video history data", 
                "statusCode": 404 
            })
        
        # --- CORRECTION 2: Use json.dumps with json_util.default ---
        jsonString = json.dumps(data, default=json_util.default) 
        return jsonString 
        
    # Creating a method for retriving a single model 
    def retriveASingleMachineLearningModel(self, id, collectionName="models"): 
        # Setting the query 
        # if isinstance(id, str):
        #     query = {"_id": ObjectId(id)}
        # else:
        #     query = {"_id": id}
        query = {"_id": ObjectId(id) }

        # Getting the collection 
        collection = self.db[collectionName]

        # Find a single document 
        data = collection.find_one(query, {
            "_id": 1, 
            "models": 1, 
            "totalFacesProcessed": 1, 
            "labels": 1 
        })

        # if the data is none type, execute the block of code below
        if data is None:  
            return (None, None, None)
        
        # 
        embeddings = pickle.loads(data['models'][0]['data']) 
        recognizerModel = pickle.loads(data['models'][1]['data']) 
        labelEncoder = pickle.loads(data['models'][2]['data']) 
        
        # Return the models
        return (embeddings, recognizerModel, labelEncoder)
    
    # Creating a method for retriving the machine learning models 
    def retriveMachineLearningModels(self, email, collectionName="models"): 
        # Setting the query 
        query = { "email": email } 

        # Getting the collection 
        collection = self.db[collectionName]
        
        # Find all the data for the model to perform analysis 
        data = list(collection.find(query, {
            "_id": 1, 
            "name": 1, 
            "email": 1, 
            "labels": 1, 
            "totalFacesProcessed": 1, 
            "dateTrained": 1, 
            "models": 1 
        }))

        # 
        if not data: 
            return jsonify({
                "status": "error", 
                "message": "No models on the database", 
                "statusCode": 400
            })
        
        # --- CORRECTION 4: Use json.dumps with json_util.default ---
        jsonString = json.dumps(data, default=json_util.default)

        # 
        return jsonString 