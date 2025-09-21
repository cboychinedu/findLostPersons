// Importing the necessary modules and components 
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Auth/AuthContext';
import logo from '../../Images/ciaLogo.png'; 

// Since we cannot use external files, we will use a simple inline SVG for the logo.
const logoSVG = (
    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

// RootNavbar component definition
const RootNavbar = () => {
  const { token } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Return the JSX for the navbar 
  return (
    <nav className="p-4 text-white flex justify-between items-center bg-[rgb(18,48,114)]">
      {/* Logo Section */}
      <div className="text-lg font-bold flex items-center">
        {logoSVG}
        <Link to="/" className="ml-2 hover:underline text-decoration-none text-white w-full">Find Missing Persons</Link>
      </div>

      {/* Hamburger menu for mobile */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden text-white focus:outline-none"
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center space-x-4">
        {token ? (
            <>
              <Link to="/dashboard" className="hover:underline text-decoration-none text-white">
                Dashboard
              </Link>
              <Link to="/logout" className="hover:underline text-decoration-none text-white">
                Logout
              </Link>
            </>
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

      {/* Mobile Menu (slides in) */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[rgb(18,48,114)] transform transition-transform duration-300 ease-in-out md:hidden z-50 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col items-start p-4 space-y-4 pt-16">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4 text-white focus:outline-none"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          {token ? (
              <>
                <Link onClick={() => setIsMobileMenuOpen(false)} to="/dashboard" className="w-full text-center hover:underline text-decoration-none text-white">
                  Dashboard
                </Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} to="/logout" className="w-full text-center hover:underline text-decoration-none text-white">
                  Logout
                </Link>
              </>
          ) : (
            <>
              <a onClick={() => setIsMobileMenuOpen(false)} href="/login" className="w-full text-center hover:underline text-decoration-none text-white">
                Login
              </a>
              <a onClick={() => setIsMobileMenuOpen(false)} href="/register" className="w-full text-center hover:underline text-decoration-none text-white">
                Register
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// Exporting the RootNavbar component as the default export 
export default RootNavbar;