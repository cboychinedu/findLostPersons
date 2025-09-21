"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing the necessary modules 
const model_1 = __importDefault(require("../model/model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = require("express");
// Creating the router object 
const router = (0, express_1.Router)();
// using a get request 
router.post('/username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the user's token from the request header
    const token = req.headers.token;
    // Return an error if the token is not found 
    if (!token) {
        // Creating an error message 
        let errorMessage = {
            message: "Token not found",
            status: "error",
            statusCode: 401
        };
        // Converting the errormessage into a JSON object 
        const responseMessage = JSON.stringify(errorMessage);
        // Sending the data 
        return res.send(responseMessage);
    }
    try {
        // Verify the token using your secret key
        const decoded = jsonwebtoken_1.default.verify(token, process.env.jwtKey || "vZr7Lz+Kk3vXnckU8FbuRCJcP");
        // Getting the email address 
        const emailAddress = decoded.email;
        // Getting the user name 
        const user = yield model_1.default.findOne({
            emailAddress: emailAddress
        });
        // If the user does not exists 
        if (!user) {
            // Setting the error message 
            let errorMessage = {
                message: "User does not exist on the database",
                status: "error",
                statusCode: 500
            };
            // Converting the error message into a Json object 
            const responseMessage = JSON.stringify(errorMessage);
            // Sending back the response message 
            return res.send(responseMessage);
        }
        // Else if the user exists 
        else if (user) {
            // Execute the block of code below if the user exists 
            const userName = user.fullname;
            // Sending the data back to the client 
            const responseData = {
                email: user.email,
                userName: userName,
                statusCode: 200,
            };
            // Converting it into json object 
            const responseMessage = JSON.stringify(responseData);
            // Sending the json object 
            return res.send(responseMessage);
        }
    }
    // Catching the error 
    catch (error) {
        // Creating the error message 
        let errorMessage = {
            message: error.toString().trim(),
            status: "error",
            statusCode: 505,
        };
        // Saving the error message as an JSON object 
        const responseMessage = JSON.stringify(errorMessage);
        // Sending the JSON object 
        return res.send(responseMessage);
    }
}));
// Exporting the routes 
exports.default = router;
