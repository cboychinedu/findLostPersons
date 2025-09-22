// Importing the necessary modules  
import jwt from 'jsonwebtoken'; 
import bcrypt from 'bcrypt'; 
import { Request, Response, Router } from 'express';
import { ErrorMessage } from '../types/serverTypes';
import User from '../model/model';

// Creating the router object 
const router = Router(); 

// Setting the route for the home page 
router.post('/register', async(req:Request, res:Response) => {
    // Using the try catch block to connect to the database 
    try{
        // Search the database to see if the user with the speciied 
        // email address is registered on the database 
        let user = await User.findOne({
            emailAddress: req.body.emailAddress
        }); 

        // If the user is found, execute the block of code below 
        if (user) {
            // Create an error message 
            let errorMessage:ErrorMessage = {
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
            const salt  = await bcrypt.genSalt(10); 
            const hashedPassword = bcrypt.hashSync(req.body.password, salt); 

            // Saving the new registered user 
            const newUser = new User({
                fullname: req.body.fullname, 
                emailAddress: req.body.emailAddress, 
                password: hashedPassword, 

            }); 

            // Saving the new user on the database 
            await newUser.save(); 

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
    catch(error:any){
        // Getting the error message 
        let errorMessage:ErrorMessage = {
            message: error.toString().trim(), 
            status: "error", 
            statusCode: 500, 
        }; 

        // Converting into JSON object 
        const responseMessage = JSON.stringify(errorMessage); 

        // Sending the data back to the user 
        return res.send(responseMessage); 
    }

})

// Creating a route for login in the registered user's 
router.post('/login', async(req:Request, res:Response) => {
    // Searching the database to see if the user with the specified 
    // email address is registered on the database 
    try {
        // Get the user details 
        const user = await User.findOne({
            emailAddress: req.body.emailAddress
        }); 

        // If the email address specified was found on the database 
        // execute the block of code below 
        if (user) {
            // Get the user password, and hashpassword 
            const userPassword = req.body.password; 
            const hashedPassword = user.password; 

            // Ghecking if the password hashed value is correct 
            const isMatch:boolean = bcrypt.compareSync(userPassword, hashedPassword); 

            // Getting the secret key 
            const jwtKey:string = process.env.jwtKey || "vZr7Lz+Kk3vXnckU8FbuRCJcP";
            
            // Checking if the passwords are correct or 
            // a match 
            if (isMatch) {
                // Create a JWT tokne 
                const token = jwt.sign({
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
                let errorMessage:ErrorMessage = {
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
            let errorMessage:ErrorMessage = {
                message: "Invalid email or password", 
                status: "error", 
                statusCode: 401, 
            }

            // Converting the error message into a json object 
            const responseMessage:any = JSON.stringify(errorMessage); 

            // Sending the response 
            return res.send(responseMessage); 

        }
    }

    // Catch the error 
    catch (error:any) {
        // Creating the error message 
        let errorMessage:ErrorMessage = {
            message: error.toString().trim(), 
            status: "error", 
            statusCode: 500, 
        }; 

        // Saving as JSON object 
        const responseMessage:any = JSON.stringify(errorMessage);
        
        // Sending the JSON object 
        return res.send(responseMessage); 
    }
}); 

// Exporting the routes 
export default router; 