// Importing the necessary module 
import "./Home.css"; 
import ciaLogo from "@images/ciaLogo.png";
import { Fragment, useEffect, useState, useContext } from 'react';
import { MoonLoader } from 'react-spinners';
import { AuthContext } from '@auth/AuthContext';
import RootNavbar from "@components/Navbar/RootNavbar";
import flashMessageFunction from "@components/FlashMessage/FlashMessage";
import axios from "axios"; 
import Footer from "@components/Footer/Footer";

const Home = () => {
  // Get setToken from context so we can store auth token globally
  const { setToken } = useContext(AuthContext);

  // Component state values
  const [loading, setLoading] = useState(true); // Loader spinner control
  const [statusMessage, setStatusMessage] = useState(""); // Flash message content
  const [emailAddress, setEmailAddress] = useState(""); // Email input value
  const [password, setPassword] = useState(""); // Password input value

  // Handle login form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page reload on form submit
    const flashMessageDiv = document.getElementById("flashMessageDiv"); 

    // Input validations
    if (emailAddress === "") {
      setStatusMessage("Email address is required"); 
      flashMessageFunction(flashMessageDiv, "Email address is required"); 
      return; 
    } else if (!emailAddress.includes("@")) {
      setStatusMessage("Your email address is incorrect"); 
      flashMessageFunction(flashMessageDiv, "Your email address is incorrect"); 
      return; 
    } else if (password === "") {
      setStatusMessage("Password is required"); 
      flashMessageFunction(flashMessageDiv, "Password is required"); 
      return; 
    }

    // Data object for request body
    const userData = {
      emailAddress: emailAddress, 
      password: password, 
    }; 

    // Your backend API endpoint (adjust to match your server route)
    const serverUrl = `${process.env.REACT_APP_SERVER_URL}/login`; 

    try {
      // Axios POST request
      const response = await axios.post(serverUrl, userData, {
        headers: { "Content-Type": "application/json" }
      });

      // Handle successful login response
      if (response.data.status === "success") {
        setStatusMessage("Login successful. Redirecting..."); 

        // Store token in localStorage + context
        const tokenValue = response.data.tokenValue;
        localStorage.setItem("xAuthToken", tokenValue);
        setToken(tokenValue); 

        // Show flash message
        flashMessageFunction(flashMessageDiv, "Login successful. Redirecting..."); 
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = "/dashboard"; 
        }, 2000); 
      } else {
        // Handle failed login response
        setStatusMessage(response.data.message || "Login failed");
        flashMessageFunction(flashMessageDiv, response.data.message || "Login failed");
      }
    } catch (err) {
      // Handle network or server errors
      console.error("Axios error:", err);
      setStatusMessage("Unable to reach server");
      flashMessageFunction(flashMessageDiv, "Unable to reach server");
    }
  };

  // Loader timeout (3s)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 3000); 
    return () => clearTimeout(timer); 
  }, []);

  return (
    <Fragment>
      {loading ? (
        // Loader spinner
        <div className="flex items-center justify-center h-screen">
          <MoonLoader color="blue" size={100} /> 
        </div>
      ) : (
        <Fragment>          
          {/* Flash Message */}
          <div> 
            <RootNavbar /> 
          </div>
          <div
            id="flashMessageDiv"
            className="
              fixed top-[4%] left-[-100%] 
              flex items-center text-left text-[16px] 
              h-[48px] pr-[92px] pt-[16px] ml-[27px] 
              border border-[#dddddd] bg-[#fffcd2] text-[#2f2727] 
              rounded-md transition-all duration-300 ease-in
            "
          >
            <p className="pl-[30px]"> {statusMessage} </p>
          </div> 

          {/* Main content with form */}
          <div className="flex flex-col md:flex-row justify-center items-center h-screen gap-10">
            
            {/* Logo */}
            <div className="flex justify-center">
              <img src={ciaLogo} alt="CIA Logo" className="h-[250px]" />
            </div>

            {/* Form */}
            <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input 
                    type="email"
                    placeholder="Enter email"
                    id="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll never share your email with anyone else.
                  </p>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input 
                    type="password"
                    placeholder="Enter Password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Checkbox + Register */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" id="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                    <span className="text-gray-700">Check me out</span>
                  </label>
                  <a href="/register" className="text-blue-600 hover:underline"> Register </a> 
                </div>

                {/* Submit */}
                <div>
                  <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Adding the footer div  */}
          <div> 
            <Footer /> 
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
