// Importing the necessary modules 
import React from "react";
import ciaLogo from "../../Images/ciaLogo.png"; 

// Creating the footer 
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[rgb(18,48,114)] text-gray-200 py-12 shadow-inner mt-[160px]">
      <div className="container mx-auto px-4">
        {/* Main Grid for Footer Content */}
        <div className="flex flex-col md:grid md:grid-cols-5 gap-8 mb-8 text-left">
          {/* Adding the logo column  */}
          <div className="flex items-center"> 
            <img className="h-[100px] -ml-[45px] "src={ciaLogo} alt="ciaLogo" /> 
          </div>

          {/* Column 1: About */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">About Us</h3>
            <p className="text-sm">
              Our mission is to assist in locating missing persons through advanced media analysis, leveraging technology to make a positive impact.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-white hover:text-white text-decoration-none transition-colors duration-300">
                  Home
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-decoration-none text-white text-sm hover:text-white transition-colors duration-300">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white text-decoration-none text-white transition-colors duration-300">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white text-decoration-none hover:text-white transition-colors duration-300">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: support@fmp.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Missing Lane, Tech City, USA</li>
            </ul>
          </div>

          {/* Column 4: Social Media */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Follow Us</h3>
            <ul className="flex space-x-4">
              <li>
                <a href="#" aria-label="Facebook" className="text-gray-200 hover:text-white transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.633 9.125 8.356 9.873V15.01H8.026V12.01h2.33V9.754c0-2.296 1.362-3.565 3.442-3.565 1.008 0 1.946.182 2.212.264v2.541h-1.55c-1.221 0-1.458.579-1.458 1.433v1.851h2.891l-.471 3.01h-2.42V21.874C18.367 21.125 22 16.991 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                </a>
              </li>
              <li>
                <a href="#" aria-label="Twitter" className="text-gray-200 hover:text-white transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.46 6c-.77.34-1.6.56-2.46.66.88-.53 1.56-1.37 1.88-2.38-.83.49-1.75.85-2.73 1.05C17.76 4.38 16.29 4 14.68 4c-2.38 0-4.32 1.94-4.32 4.32 0 .34.04.67.11 1-.83-.04-1.59-.2-2.33-.5-1.57-1.12-2.62-3.13-2.62-5.32 0-.8.1-1.58.3-2.3-.43.23-.84.53-1.2.87-.97 1.48-1.57 3.23-1.57 5.12 0 1.25.32 2.45.88 3.52-.36-.08-.7-.16-1.04-.26-.7-.18-1.39-.38-2.07-.65v-.05c0 1.76 1.25 3.23 2.91 3.56-.3.08-.62.12-.95.12-.23 0-.46-.02-.68-.07.46 1.46 1.8 2.52 3.39 2.55-1.46 1.13-3.23 1.7-5.04 1.7-.33 0-.65-.02-.97-.06 1.89 1.2 4.14 1.91 6.55 1.91 7.86 0 12.16-6.52 12.16-12.16v-.5c.83-.6 1.54-1.28 2.08-2.1z"/>
                  </svg>
                </a>
              </li>
              <li>
                <a href="#" aria-label="LinkedIn" className="text-gray-200 hover:text-white transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-5.99 15.5h2.52V12.75h2.33v-1.92h-2.33V9.12c0-.52.26-.78.78-.78h1.55v-1.92h-1.55c-1.42 0-2.36.94-2.36 2.36v1.44h-2.52V18.5H5v-7.18h2.35v1.92h-2.35v4.92z"/>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright and Bottom Links */}
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-sm">
            &copy; {currentYear} Find Missing Persons Application. All rights reserved.
          </p>
          <div className="mt-2 text-xs text-gray-400 space-x-4">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <span className="text-gray-600">|</span>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Exporting the footer 
export default Footer;
