// Importing the necessary modules 
import User from "../model/model";
import jwt from "jsonwebtoken"; 
import { ErrorMessage, successData } from "../types/serverTypes";
import { Request, Response, Router } from "express"; 

// Creating the router object 
const router = Router(); 

// using a get request 
router.post('/username', async (req: Request, res: Response) => {
    // Get the user's token from the request header
    const token:any = req.headers.token;  

    // Return an error if the token is not found 
    if (!token) {
        // Creating an error message 
        let errorMessage:ErrorMessage = {
            message: "Token not found", 
            status: "error", 
            statusCode: 401
        } 

        // Converting the errormessage into a JSON object 
        const responseMessage:any = JSON.stringify(errorMessage); 

        // Sending the data 
        return res.send(responseMessage); 
    }

    try {
        // Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.jwtKey || "vZr7Lz+Kk3vXnckU8FbuRCJcP") as { 
            email: string; 
            isLoggedIn: boolean; 
            id: number  
        }; 

        // Getting the email address 
        const emailAddress:string = decoded.email 

        // Getting the user name 
        const user = await User.findOne({ 
            emailAddress: emailAddress 
        });

        // If the user does not exists 
        if (!user) {
            // Setting the error message 
            let errorMessage:ErrorMessage = {
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
            const userName:string = user.fullname; 

            // Sending the data back to the client 
            const responseData:successData = {
                email: user.email,
                userName: userName,
                statusCode: 200, 
            }

            // Converting it into json object 
            const responseMessage:any = JSON.stringify(responseData); 

            // Sending the json object 
            return res.send(responseMessage);
        }

    } 
    // Catching the error 
    catch (error:any) {
        // Creating the error message 
        let errorMessage:ErrorMessage = {
            message: error.toString().trim(), 
            status: "error", 
            statusCode: 505, 
        }; 

        // Saving the error message as an JSON object 
        const responseMessage:any = JSON.stringify(errorMessage);

        // Sending the JSON object 
        return res.send(responseMessage); 
    }
});

// Exporting the routes 
export default router;