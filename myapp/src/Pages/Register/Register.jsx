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
    // Setting the state for status message and form inputs
    const [statusMessage, setStatusMessage] = useState("");  
    const [fullname, setFullname] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");

    // Creating a function for handling the Submit Register
    const handleSubmitRegister = (event) => {
        // Prevent the default form submission behavior (page reload)
        event.preventDefault();

        // Get the flash message div
        const flashMessageDiv = document.getElementById("flashMessageDiv");
        
        // Checking if the fullname is valid 
        if (fullname === "") {
            // Setting the state and opening the flashmessage
            setStatusMessage("Fullname is required"); 
            flashMessageFunction(flashMessageDiv, "Fullname is required"); 
            return; 
        }

        // Using else if to check if the email address is present 
        else if (emailAddress === "") {
            // Setting the state and opening the flash message
            setStatusMessage("Email address is required"); 
            flashMessageFunction(flashMessageDiv, "Email address is required"); 
            return; 
        }
        
        // Using else if to check if the @ was used in the email address 
        else if (emailAddress.indexOf("@") === -1) {
            // Setting the state and opening the flash message
            setStatusMessage("Your email address is incorrect"); 
            flashMessageFunction(flashMessageDiv, "Your email address is incorrect"); 
            return; 
        }

        // using else if to check the password. 
        else if (password === "") {
            // Setting the state and opening the flash mesage
            setStatusMessage("Password is required"); 
            flashMessageFunction(flashMessageDiv, "Password is required"); 
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

            // Using fetch request 
            fetch(serverUrl, {
                method: "POST", 
                headers: { "Content-Type": "application/json"}, 
                body: userData
            })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData); 
                alert(responseData); 
            });
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
                    <Form onSubmit={handleSubmitRegister}> 
                        <Form.Group className="mb-3" controlId="formFullname"> 
                            <Form.Label> Fullname </Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter your fullname" 
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEmailAddress"> 
                            <Form.Label> Email Address </Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="Enter your email address"
                                value={emailAddress}
                                onChange={(e) => setEmailAddress(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPassword"> 
                            <Form.Label> Password </Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group> 
                            <div className={styles.userLoginDiv}> 
                                <Form.Check type="checkbox" label="Check me out" className={styles.labelTag} id="checkbox"/> 
                                <Link to="/"> Go Home </Link>
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="formBasicButton">
                            <Button className="w-100" type="submit"> Register </Button>
                        </Form.Group>
                    </Form>
                </div>
            </div>
        </Fragment>
    ); 
}

// Exporting the Register component 
export default Register;