// importing the necessary modules 
import "./Home.css"; 
import styles from "./Home.module.css"; 
import ciaLogo from "../../Images/ciaLogo.png";
import { Fragment, useEffect, useState, useContext } from 'react';
import { Form, Button } from "react-bootstrap";
import { BarLoader, MoonLoader } from 'react-spinners';
import { Link } from "react-router-dom";
import { AuthContext } from '../../Auth/AuthContext';
import flashMessageFunction from "../../Components/FlashMessage/FlashMessage";

// rendering the Home component 
const Home = () => {
  // Accessing the Auth context using the useContext hook 
  const { setToken } = useContext(AuthContext);

  // Setting the state 
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(""); 
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  // setting a function for getting the input forms 
  const handleSubmit = (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // The flash message div can be retrieved here if needed
    const flashMessageDiv = document.getElementById("flashMessageDiv"); 

    // Using if/ else statement to test for the data 
    if (emailAddress === "") {
      // Setting the state 
      setStatusMessage("Email address is required"); 
      // Opening the flash message function 
      flashMessageFunction(flashMessageDiv, "Email address is required"); 
      return; 
    }
    // Checking for the @ symbol 
    else if (emailAddress.indexOf("@") === -1) {
      // Setting the state 
      setStatusMessage("Your email address is incorrect"); 
      // Opening the flash message 
      flashMessageFunction(flashMessageDiv, "Your email address is incorrect"); 
      return; 
    }
    // Else if the password field is missing 
    else if (password === "") {
      // Setting the state 
      setStatusMessage("Password is required"); 
      // Opening the flash message function 
      flashMessageFunction(flashMessageDiv, "Password is required"); 
      return; 
    }

    // Else if the submission data was validated, 
    // execute the block of code below 
    // Saving the user's input data 
    const userData = JSON.stringify({
       emailAddress: emailAddress, 
       password: password, 
    }); 

    // Setting the server url 
    const serverUrl = "http://localhost:5000/login"; 

    // Using fetch request 
    fetch(serverUrl, {
      method: "POST", 
      headers: { "Content-Type": "application/json"}, 
      body: userData
    })
    .then((response) => response.json())
    .then((responseData) => {
      // if the response data has the success key 
      if (responseData.status === "success") {
        // Setting the state 
        setStatusMessage("Login successful. Redirecting..."); 

        // Getting the token 
        const tokenValue = responseData.tokenValue;

        // Saving the token to local storage
        localStorage.setItem("xAuthToken", tokenValue);

        // Update the token in context
        setToken(tokenValue); 

        // Opening the flash message function 
        flashMessageFunction(flashMessageDiv, "Login successful. Redirecting..."); 
        
        // Redirecting the user to the dashboard after 2 seconds 
        setTimeout(() => {
          window.location.href = "/dashboard"; 
        }, 2000); 
      }
    });
  };

  // Using the useEffect hooks 
  useEffect(() => {
    // setting the timer 
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 3000); 
    // Clearing the timeout 
    return () => clearTimeout(timer); 
  }, []);

  // rendering the jsx component 
  return (
    <Fragment>
      {loading ? (
        <div className={styles.mainDiv}> 
            <MoonLoader color="blue" size="100" /> 
        </div>
      ) : (
        <Fragment>          
          {/* Adding the flash message */}
          <div className="flashMessageDiv" id="flashMessageDiv"> 
              <p> {statusMessage} </p> 
          </div> 
          <div className={styles.mainDiv}>
              <div className={styles.logoDiv}>
                  <img src={ciaLogo} alt="CIA Logo" className={styles.ciaLogo} />
              </div>
              <div>
                  <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label> Email Address </Form.Label>
                          <Form.Control 
                              type="email" 
                              placeholder="Enter email" 
                              id="email"
                              value={emailAddress}
                              onChange={(e) => setEmailAddress(e.target.value)}
                          />
                          <Form.Text className="text-muted"> 
                              We'll never share your email with anyone else. 
                          </Form.Text>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicPassword">
                          <Form.Label> Password </Form.Label>
                          <Form.Control 
                              type='password' 
                              placeholder='Enter Password' 
                              id="password" 
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                          />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicCheckbox" >
                        <div className={styles.userRegisterDiv}> 
                          <Form.Check type="checkbox" label="Check me out" className={styles.labelTag} id="checkbox"/> 
                          <Link to="/register"> Register Here </Link>
                        </div>
                      </Form.Group>
                      <Form.Group className="mb-2" controlId="formBasicButton">
                          <Button className="w-100" type="submit"> Login </Button>
                      </Form.Group>
                  </Form>
              </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

// exporting the Home component 
export default Home;