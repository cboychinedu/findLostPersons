// Import the necssary modules 
import "./Register.css";
import { Link } from "react-router-dom";
import styles from "./Register.module.css"; 
import ciaLogo from "../../Images/ciaLogo.png"; 
import { Fragment, useState } from "react";
import { Form, Button } from "react-bootstrap"; 
import flashMessageFunction from "../../Components/FlashMessage/FlashMessage"; 

// Rendering the register component 
const Register = () => {
    // Setting the state 
    const [statusMessage, setStatusMessage] = useState("");  

    // Creating a function for handling the Submit Register
    const handleSubmitRegister = (event) => {
        // Getting the fullname, email, password 
        const fullname = document.querySelector("#fullname").value; 
        const emailAddress = document.querySelector("#emailAddress").value; 
        const password = document.querySelector("#password").value;
        const flashMessageDiv = document.getElementById("flashMessageDiv");
        
        // Checking if the fullname is valid 
        if (fullname === "") {
            // Setting the state 
            setStatusMessage("Fullname is required"); 

            // Opening the flashmessage 
            flashMessageFunction(flashMessageDiv, fullname); 
            
            // pausing the submit button. 
            return; 

        }

        // Using else if to check if the email address is present 
        else if (emailAddress === "") {
            // Setting the state 
            setStatusMessage("Email address is required"); 

            // Opening the flash message 
            flashMessageFunction(flashMessageDiv, emailAddress); 

            // Pausing the submission 
            return; 
        }

        // using else if to check the password. 
        else if (password === "") {
            // Setting the state 
            setStatusMessage("Password is required"); 

            // Opening the flash mesage 
            flashMessageFunction(flashMessageDiv, password); 

            // Pausing the submission 
            return; 

        }

        // Using else if to check if the @ was used in the email address 
        else if (emailAddress.indexOf("@") === -1) {
            // Setting the state 
            setStatusMessage("Your email address is incorrect"); 

            // Opening the flash message 
            flashMessageFunction(flashMessageDiv, emailAddress); 

            // Pausing the submission
            return; 

        }

        // Else all the submission was correct 
        else {
        // Saving the user's input data 
        const userData = JSON.stringify({
            fullname: fullname, 
            emailAddress: emailAddress, 
            password: password, 
        }); 

        // Setting the server url 
        const serverUrl = "http://localhost:5000/register"; 

        // Using fetch reqest 
        fetch(serverUrl, {
            method: "POST", 
            headers: { "Content-Type": "application/json"}, 
            body: userData
        })
        .then((response) => response.json())
        .then((responseData) => {
            console.log(responseData); 
            alert(responseData); 
        } )
            console.log(password); 
        }

    }

    // Rendering the jsx component 
    return (
        <Fragment>
            {/* Adding the flash message */}
            <div className="flashMessageDiv" id="flashMessageDiv"> 
                <p> {statusMessage} </p> 
            </div> 

            {/* Adding the cia logo div  */}
            <div className={styles.mainDiv}>
                <div className={styles.logoDiv}>
                    <img src={ciaLogo} alt="CIA Logo" className={styles.ciaLogo} /> 
                </div>
                {/* Adding the form div  */}
                <div> 
                    <Form> 
                        <Form.Group className="mb-3" controlId="formBasicEmail"> 
                            <Form.Label> Fullname </Form.Label>
                            <Form.Control type="text" placeholder="Enter your fullname" id="fullname" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail"> 
                            <Form.Label> Email Address  </Form.Label>
                            <Form.Control type="email" placeholder="Enter your email address" id="emailAddress" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail"> 
                            <Form.Label> Password  </Form.Label>
                            <Form.Control type="password" placeholder="Enter your password" id="password" />
                        </Form.Group>
                        <Form.Group> 
                            <div className={styles.userLoginDiv}> 
                                <Form.Check type="checkbox" label="Check me out" className={styles.labelTag} id="checkbox"/> 
                                <Link to="/"> Go Home </Link>
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="formBasicButton">
                            <Button className="w-100" onClick={handleSubmitRegister}> Register  </Button>
                        </Form.Group>
                        
                    </Form>
                </div>
            </div>
        </Fragment>
    ); 
}

// Exporting the Register component 
export default Register; 