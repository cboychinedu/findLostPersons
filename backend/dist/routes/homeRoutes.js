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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = require("express");
const model_1 = __importDefault(require("../model/model"));
// Creating the router object 
const router = (0, express_1.Router)();
// Setting the route for the home page 
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Using the try catch block to connect to the database 
    try {
        // Search the database to see if the user with the speciied 
        // email address is registered on the database 
        let user = yield model_1.default.findOne({
            emailAddress: req.body.emailAddress
        });
        // If the user is found, execute the block of code below 
        if (user) {
            // Create an error message 
            let errorMessage = {
                message: "The user with the email address is already registered",
                status: "userRegistered",
                statusCode: 404,
            };
            // Converting into a json object 
            const responseMessage = JSON.stringify(errorMessage);
            // Sending the error message 
            return res.send(responseMessage);
        }
        // else if the email for the user was not found on the database, 
        // execute the block of code below 
        else {
            // Encrypt the password and create a salt hash 
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashedPassword = bcrypt_1.default.hashSync(req.body.password, salt);
            // Saving the new registered user 
            const newUser = new model_1.default({
                fullname: req.body.fullname,
                emailAddress: req.body.emailAddress,
                password: hashedPassword,
            });
            // Saving the new user on the database 
            yield newUser.save();
            // Generating the success message 
            let successMessage = JSON.stringify({
                message: "User newly registered",
                status: "success",
                statusCode: 200,
            });
            // Return the success message 
            return res.send(successMessage);
        }
    }
    // Catching the error 
    catch (error) {
        // Getting the error message 
        let errorMessage = {
            message: error.toString().trim(),
            status: "error",
            statusCode: 500,
        };
        // Converting into JSON object 
        const responseMessage = JSON.stringify(errorMessage);
        // Sending the data back to the user 
        return res.send(responseMessage);
    }
}));
// Creating a route for login in the registered user's 
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Searching the database to see if the user with the specified 
    // email address is registered on the database 
    try {
        // Get the user details 
        const user = yield model_1.default.findOne({
            emailAddress: req.body.emailAddress
        });
        // If the email address specified was found on the database 
        // execute the block of code below 
        if (user) {
            // Get the user password, and hashpassword 
            const userPassword = req.body.password;
            const hashedPassword = user.password;
            // Ghecking if the password hashed value is correct 
            const isMatch = bcrypt_1.default.compareSync(userPassword, hashedPassword);
            // Getting the secret key 
            const jwtKey = process.env.jwtKey || "vZr7Lz+Kk3vXnckU8FbuRCJcP";
            // Checking if the passwords are correct or 
            // a match 
            if (isMatch) {
                // Create a JWT tokne 
                const token = jsonwebtoken_1.default.sign({
                    email: user.emailAddress,
                    isLoggedIn: true,
                    id: user._id
                }, jwtKey, {
                    expiresIn: "30 days",
                });
                // Creating the success message 
                let successMessage = JSON.stringify({
                    message: "Logged in successfully",
                    status: "success",
                    tokenValue: token,
                    statusCode: 200,
                });
                // Sending the success message 
                return res.send(successMessage);
            }
            // Else if it wasn't a match 
            else {
                // Create an error message 
                let errorMessage = {
                    message: "Invalid email or password",
                    status: "error",
                    statusCode: 401,
                };
                // Converting the error message into a JSON object 
                const responseMessage = JSON.stringify(errorMessage);
                // Sending back the response 
                return res.send(responseMessage);
            }
        }
        // Else if the user does not exists, execute the 
        // block of code below 
        else {
            // Create the error message 
            let errorMessage = {
                message: "Invalid email or password",
                status: "error",
                statusCode: 401,
            };
            // Converting the error message into a json object 
            const responseMessage = JSON.stringify(errorMessage);
            // Sending the response 
            return res.send(responseMessage);
        }
    }
    // Catch the error 
    catch (error) {
        // Creating the error message 
        let errorMessage = {
            message: error.toString().trim(),
            status: "error",
            statusCode: 500,
        };
        // Saving as JSON object 
        const responseMessage = JSON.stringify(errorMessage);
        // Sending the JSON object 
        return res.send(responseMessage);
    }
}));
// Exporting the server 
exports.default = router;
