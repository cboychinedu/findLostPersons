import "./Home.css"; 
import ciaLogo from "../../Images/ciaLogo.png";
import { Fragment, useEffect, useState, useContext } from 'react';// (optional, can be replaced with pure Tailwind)
import { MoonLoader } from 'react-spinners';
import { AuthContext } from '../../Auth/AuthContext';
import RootNavbar from "../../Components/Navbar/RootNavbar";
import flashMessageFunction from "../../Components/FlashMessage/FlashMessage";

const Home = () => {
  const { setToken } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(""); 
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const flashMessageDiv = document.getElementById("flashMessageDiv"); 

    if (emailAddress === "") {
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
       emailAddress: emailAddress, 
       password: password, 
    }); 

    const serverUrl = "http://localhost:5000/login"; 

    fetch(serverUrl, {
      method: "POST", 
      headers: { "Content-Type": "application/json"}, 
      body: userData
    })
    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.status === "success") {
        setStatusMessage("Login successful. Redirecting..."); 
        const tokenValue = responseData.tokenValue;
        localStorage.setItem("xAuthToken", tokenValue);
        setToken(tokenValue); 
        flashMessageFunction(flashMessageDiv, "Login successful. Redirecting..."); 
        
        setTimeout(() => {
          window.location.href = "/dashboard"; 
        }, 2000); 
      }
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 3000); 
    return () => clearTimeout(timer); 
  }, []);

  return (
    <Fragment>
      {loading ? (
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
          ">
            <p className="pl-[30px]"> {statusMessage} </p>
          </div> 

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
                  {/* <Link to="/register" className="text-blue-600 hover:underline">
                    Register Here
                  </Link> */}
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
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
