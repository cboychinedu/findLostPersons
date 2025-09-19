// Importing the necessary modules and components 
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Auth/AuthContext';
import logo from '../../Images/ciaLogo.png'; // Adjust the path as necessary

// RootNavbar component definition
const RootNavbar = () => {
  const { token } = useContext(AuthContext);

  // Return the JSX for the navbar 
  return (
    <nav className="p-4 text-white flex justify-between items-center bg-[rgb(18,48,114)]">
      <div className="text-lg font-bold">
        <img src={logo}  alt="Logo" className="inline-block mr-2 w-16 h-[35px]"  />
        <Link to="/" className="hover:underline text-decoration-none text-white">Find Missing Persons</Link>
      </div>
      <div>
        {token ? (
          <Link to="/dashboard" className="hover:underline text-decoration-none text-white">
            Dashboard
          </Link>
        ) : (
          <>
            <a href="/login" className="mr-4 hover:underline text-decoration-none text-white">
              Login
            </a>
            <a href="/register" className="hover:underline text-decoration-none text-white">
              Register
            </a>
          </>
        )}
      </div>
    </nav>
  );
};

// Exporting the RootNavbar component as the default export 
export default RootNavbar;