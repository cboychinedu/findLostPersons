// Importing the necessary modules 
import React, { useContext, useState } from 'react';
import { AuthContext } from '@auth/AuthContext';
import logo from '@images/ciaLogo.png'; 

// Since we cannot use external files, we will use a simple inline SVG for the logo.
const logoSVG = (
    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

// Dashboard component 
const DashboardNavbar = () => {
    const { removeToken } = useContext(AuthContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 

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
            <div className="text-lg font-bold flex items-center"> 
                <img src={logo} alt="CIA logo" className="h-[50px]" /> 
                <a href="/dashboard" className="ml-2 hover:underline text-decoration-none text-white">Find Missing Persons</a>
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

            {/* Desktop navigation as */}
            <div className="hidden md:flex items-center space-x-4"> 
                <a href="/trainNeuralNetwork" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded hover:underline text-decoration-none mt-[2px] "> 
                    Train Neural Net On Missing Persons
                </a> 
                <a href="/history" className="hover:underline text-decoration-none text-white"> 
                    Analyzed Data  
                </a>
                <a href="/dashboard" className="hover:underline text-decoration-none text-white">
                    Dashboard 
                </a>
                <a onClick={logoutUser} href="#" className="text-decoration-none text-white"> Logout </a>
            </div>

            {/* Mobile menu (hidden by default) */}
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
                    <a onClick={() => setIsMobileMenuOpen(false)} href="#" className="w-full text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded hover:underline text-decoration-none">
                        Train Neural Net On Missing Persons
                    </a>
                    <a onClick={() => setIsMobileMenuOpen(false)} href="#" className="w-full text-center hover:underline text-decoration-none text-white">
                        Analyzed Videos
                    </a>
                    <a onClick={() => setIsMobileMenuOpen(false)} href="/dashboard" className="w-full text-center hover:underline text-decoration-none text-white">
                        Dashboard
                    </a>
                    <a onClick={() => { logoutUser(); setIsMobileMenuOpen(false); }} href="#" className="w-full text-center text-decoration-none text-white">
                        Logout
                    </a>
                </div>
            </div>
        </nav>
    );
}; 

// Exporting the default dashboard 
export default DashboardNavbar;