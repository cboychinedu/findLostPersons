// Importing the necessary modules 
import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Auth/AuthContext';
import logo from '../../Images/ciaLogo.png'; 

// Dashboard component 
const DashboardNavbar = () => {
    const { token } = useContext(AuthContext);

    // Creating a function for logging out the user 
    const logoutUser = (event) => {
        // Clearing the local storage 
        localStorage.clear(); 

        // Redirecting the user to the login page 
        setInterval(() => {
            // redirection 
            window.location.href = "/";
        }, 1000); 
    }

    // return the jsx component 
    return (
        <nav className="p-4 text-white flex justify-between items-center bg-[rgb(18,48,114)]"> 
            <div className="text-lg font-bold"> 
                <img src={logo} alt="Logo" className="inline-block mr-2 w-16 h-[35px]" />
 <Link to="/dashboard" className="hover:underline text-decoration-none text-white w-[100%]">Find Missing Persons</Link>
            </div>
            <div className="flex justify-space mr-[20px]"> 
                <Link to="/dashboard" className="mr-[20px] hover:underline text-decoration-none text-white">
                    Dashboard 
                </Link>
                <Link onClick={logoutUser} to="#" className="mr-[10px] text-decoration-none text-white"> Logout </Link>
            </div>
        </nav>
    );
}; 

// Exporting the default dashboard 
export default DashboardNavbar;