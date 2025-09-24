// Importing the necessary modules 
import "./Register.css"; // Importing the CSS file for the Register component's styles.
import RootNavbar from "../../Components/Navbar/RootNavbar"; // Importing the navigation bar component for the root (public) pages.
import ciaLogo from "../../Images/ciaLogo.png"; // Importing the CIA logo image asset.
import { Fragment, useState } from "react"; // Importing Fragment and useState hook from React to manage component state.
import Footer from "../../Components/Footer/Footer"; // Importing the Footer component.
import flashMessageFunction from "../../Components/FlashMessage/FlashMessage"; // Importing a utility function to display flash messages.


const Register = () => {
  // Setting the state variables using the useState hook.
  // State for the user's full name.
  // State for the user's email address.
  // State for the user's password.
  // This state holds the message to be displayed in the flash message div.
  const [statusMessage, setStatusMessage] = useState("");  
  const [fullname, setFullname] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  // Function to handle the form submission.
  const handleSubmitRegister = (event) => {
    // Preventing the default form submission behavior to handle it with JavaScript.
    event.preventDefault();

    // Getting the flash message div element from the DOM using its ID.
    const flashMessageDiv = document.getElementById("flashMessageDiv");

    // Validating the input fields. If a field is empty, a status message is set and a flash message is displayed.
    if (fullname === "") {
      
      // Setting the status message for the UI.
      setStatusMessage("Fullname is required");
      
      // Calling the flash message utility function to show an alert.
      flashMessageFunction(flashMessageDiv, "Fullname is required");
     
      // Stopping the function's execution.
      return;
    } 
    // Checking if the email address is empty.
    else if (emailAddress === "") {
      setStatusMessage("Email address is required");
      flashMessageFunction(flashMessageDiv, "Email address is required");
      return;
    } 
    
    // Checking if the email address format is incorrect (lacks an "@" symbol).
    else if (emailAddress.indexOf("@") === -1) {
      setStatusMessage("Your email address is incorrect");
      flashMessageFunction(flashMessageDiv, "Your email address is incorrect");
      return;
    } 
    
    // Checking if the password is empty.
    else if (password === "") {
      setStatusMessage("Password is required");
      flashMessageFunction(flashMessageDiv, "Password is required");
      return;
    }

    // Creating a JSON object with the user data.
    const userData = JSON.stringify({
      fullname,
      emailAddress,
      password,
    });

    // Defining the server URL for the registration endpoint.
    const serverUrl = `${process.env.REACT_APP_SERVER_URL}/register`;

    // Using try-catch for error handling during the fetch request.
    try {
      // Sending a POST request to the server with the user data.
      fetch(serverUrl, {
        method: "POST", // Specifying the HTTP method.
        headers: { "Content-Type": "application/json" }, // Setting the content type header.
        body: userData, // Attaching the JSON data to the request body.
      })
      // Handling the response from the server.
      .then((response) => response.json())
      .then((responseData) => {
        // Handle the successful register response 
        if (responseData.status === "success") {
          
          // Set the status message for the UI.
          setStatusMessage("User registered!. Redirecting..."); 
          
          // Display a success flash message.
          flashMessageFunction(flashMessageDiv, responseData.message);

          // Redirecting the user to the login page after a delay.
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);  // Delay of 2 seconds.

        }
        // Else if the status was not successful 
        else {
          // handle the failed login response 
          // Set the status message to the error message from the server or a default message.
          setStatusMessage(responseData.message || "Register failed");
          
          // Display the failed flash message.
          flashMessageFunction(flashMessageDiv, responseData.message || "Register failed");
        }
      });
    }

    // Catch the error if the data was not sent to the 
    // server 
    catch (error) {
      // Handle network or server errors 
      console.log("Fetch error:", error); // Logging the error to the console for debugging.
      setStatusMessage("Unable to reach server"); // Setting a user-friendly status message.
      flashMessageFunction(flashMessageDiv, error.message || "Unable to reach server"); // Displaying a flash message for the error.
      
    }
  };

  // Rendering the component's UI.
  return (
    <Fragment>
    <div> 
        <RootNavbar /> 
    </div>
    {/* Flash Message */}
     <div
    id="flashMessageDiv"
    className="
        fixed top-[4%] left-[-100%] 
        flex items-center text-left text-[16px] 
        h-[48px] pr-[92px] pt-[16px] ml-[27px] 
        border border-[#dddddd] bg-[#fffcd2] text-[#2f2727] 
        rounded-md transition-all duration-300 ease-in">
        <p className="pl-[30px]"> {statusMessage} </p>
    </div>

      {/* Main container */}
      <div className="flex flex-col md:flex-row items-center justify-center h-screen gap-10">
        
        {/* Logo */}
        <div className="flex justify-center mt-[80px] ">
          <img src={ciaLogo} alt="CIA Logo" className="h-[250px]" />
        </div>

        {/* Form */}
        <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6">
          <form onSubmit={handleSubmitRegister} className="space-y-4">
            
            {/* Fullname */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fullname
              </label>
              <input
                type="text"
                placeholder="Enter your fullname"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm 
                           focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm 
                           focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm 
                           focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Checkbox + Login Link */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-gray-700">Check me out</span>
              </label>
              <a href="/" className="text-blue-600 hover:underline text-sm">
                Login
              </a>
            </div>

            {/* Register Button */}
            <div>
              <button
                onClick={handleSubmitRegister}
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Register
              </button>
            </div>
          </form>
        </div> 
      </div>

        {/* Adding the footer  */}
        <Footer /> 
    </Fragment>
  );
};

// Exporting the register component 
export default Register;