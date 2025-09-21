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
const express_1 = require("express");
// Creating the router object 
const router = (0, express_1.Router)();
// using a get request 
router.post('/username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the user's token from the request header
    const token = req.header('token');
    // Return an error if the token is not found 
    if (!token) {
        return res.status(401).json({
            status: "Failed",
            message: "Authorization token not found.",
            statusCode: 401
        });
    }
    try {
        // Verify the token using your secret key
        const decoded = jsonwebtoken_1.default.verify(token, process.env.jwtKey || "vZr7Lz+Kk3vXnckU8FbuRCJcP");
        // Get the email address 
        const emailAddress = decoded.email;
        // 
        console.log(emailAddress);
        // Send the username back in the response
        return res.status(200).json({
            status: "Success",
            email: decoded.email,
        });
    }
    catch (error) {
        // Handle token verification errors (e.g., invalid token)
        console.error("Token verification failed:", error);
        res.status(401).json({
            status: "Failed",
            message: "Invalid token.",
            statusCode: 401
        });
    }
}));
// Exporting the routes 
exports.default = router;
