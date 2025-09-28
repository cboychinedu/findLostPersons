// Importing the necessary modules 
import { Fragment } from 'react'
import Footer from "@components/Footer/Footer"; 
import RootNavbar from '@components/Navbar/RootNavbar';
import servicesData from '@components/ServiceData/ServicesData';
import ServiceCard from '@components/ServiceData/ServiceCard';

// Main App component containing the Services Page structure
const Services = () => {
    return (
        <Fragment> 
            {/* Adding the navbar  */}
            <RootNavbar /> 

            <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-8 mt-[100px]">
                <div className="max-w-6xl mx-auto">
                    
                    {/* Header Section - Responsive Centered Text */}
                    <header className="text-center mb-12 py-8 bg-white rounded-xl shadow-lg">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                            Our Dedicated Services
                        </h1>
                        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                            We provide specialized tools and support designed to assist families and authorities in the critical process of finding and reuniting missing persons.
                        </p>
                    </header>

                    {/* Services Grid - Responsive Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {servicesData.map((service, index) => (
                            <ServiceCard key={index} {...service} />
                        ))}
                    </div>

                    {/* Call to Action Banner - Responsive Layout */}
                    <div className="mt-16 bg-indigo-700 text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between">
                        <div className="mb-4 md:mb-0">
                            <h2 className="text-2xl font-bold">Ready to Start a Report?</h2>
                            <p className="text-indigo-200 mt-1">
                                Use our step-by-step guided submission process now.
                            </p>
                        </div>
                        <button className="bg-white text-indigo-700 font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-100 transition duration-300 w-full md:w-auto">
                            File a New Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Adding footer  */}
            <Footer /> 
        </Fragment>
    );
};

// Exporting the services 
export default Services;
