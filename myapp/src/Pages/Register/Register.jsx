// Importing the necessary modules 
import "./Register.css";
import RootNavbar from "../../Components/Navbar/RootNavbar";
import ciaLogo from "../../Images/ciaLogo.png"; 
import { Fragment, useState } from "react";
import flashMessageFunction from "../../Components/FlashMessage/FlashMessage"; 


const Register = () => {
  const [statusMessage, setStatusMessage] = useState("");  
  const [fullname, setFullname] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmitRegister = (event) => {
    event.preventDefault();

    const flashMessageDiv = document.getElementById("flashMessageDiv");

    if (fullname === "") {
      setStatusMessage("Fullname is required");
      flashMessageFunction(flashMessageDiv, "Fullname is required");
      return;
    } else if (emailAddress === "") {
      setStatusMessage("Email address is required");
      flashMessageFunction(flashMessageDiv, "Email address is required");
      return;
    } else if (emailAddress.indexOf("@") === -1) {
      setStatusMessage("Your email address is incorrect");
      flashMessageFunction(flashMessageDiv, "Your email address is incorrect");
      return;
    } else if (password === "") {
      setStatusMessage("Password is required");
      flashMessageFunction(flashMessageDiv, "Password is required");
      return;
    }

    const userData = JSON.stringify({
      fullname,
      emailAddress,
      password,
    });

    const serverUrl = "http://localhost:5000/register";

    fetch(serverUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: userData,
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        alert(responseData);
      });
  };

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
        <div className="flex justify-center">
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
    </Fragment>
  );
};

export default Register;
