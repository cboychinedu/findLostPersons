// Importing the necessary modules 
import React, { Fragment, useEffect, useState } from "react";
import DashboardNavbar from "@components/Navbar/DashboardNavbar";
import RootNavbar from "@components/Navbar/RootNavbar";
import Footer from "@components/Footer/Footer";
import sections from "@components/HomeData/Sections";

// Mock token logic (since direct localStorage access is not guaranteed to be consistent, we simulate for demo)
const tokenValue = localStorage.getItem("xAuthToken") || null;

// Main Home Component
const Home = () => {
    // State to handle fade-in effect on mount
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Trigger fade-in after a short delay
        setIsVisible(true);
    }, []);

    // Loader timeout (3s)
    useEffect(() => {
        const timer = setTimeout(() => {
        setLoading(false); 
        }, 3000); 
        return () => clearTimeout(timer); 
    }, []);

    // Rendering the component 
    return (
        <Fragment>
            {loading ? (
                // Loader spinner (using Tailwind CSS classes since external imports like MoonLoader are not allowed)
                <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-indigo-600 border-t-4 border-gray-200"></div>
                    <p className="mt-4 text-xl font-medium text-gray-700">Loading BlackBox Analytics...</p>
                </div>
            ) : (
                <Fragment>
                    {/* Adding the navbar - Fixed syntax issue by wrapping content in a Fragment */}
                    {tokenValue ? <DashboardNavbar /> : <RootNavbar />}
                    
                    <main className="pt-20 bg-gray-50 min-h-screen font-sans">
                        {/* --- Hero Section --- */}
                        <section 
                            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center transition-opacity duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        >
                            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
                                BlackBox <span className="text-indigo-600"> Media Analysis</span>
                            </h1>
                            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
                                Quickly analyze images and videos using your custom-trained machine learning models. Upload, select, and process with ease.
                            </p>
                            <div className="mt-10 flex justify-center space-x-4">
                                <a 
                                    href="/login" 
                                    className="px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105 animate-pulse text-decoration-none"
                                >
                                    Start Analyzing Now
                                </a>
                                <a 
                                    href="/about" 
                                    className="px-8 py-4 text-lg font-bold text-indigo-600 bg-white border-2 border-indigo-600 rounded-xl shadow-lg hover:bg-indigo-50 transition duration-300 transform hover:scale-105 text-decoration-none"
                                >
                                    Learn More
                                </a>
                            </div>
                        </section>
                        
                        {/* --- How to Navigate/Use Section --- */}
                        <section className="bg-white py-16 sm:py-24">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-12">
                                    How to Navigate the Dashboard
                                </h2>
                                
                                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
                                    {sections.map((item, index) => (
                                        <div 
                                            key={index} 
                                            // Custom staggered slide-up animation effect
                                            // FIX: Ensuring opacity-100 is applied when visible to prevent permanent opacity: 0 issue.
                                            className={`bg-gray-50 p-6 rounded-xl shadow-xl border-t-4 border-indigo-500 transform hover:scale-[1.02] transition duration-500 ease-in-out hover:shadow-2xl ${isVisible ? 'opacity-100 animate-slide-up' : 'opacity-0'}`}
                                            style={{ animationDelay: `${index * 200 + 500}ms` }}
                                        >
                                            <div className="flex items-center space-x-4 mb-4">
                                                {item.icon}
                                                <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                                            </div>
                                            <p className="text-gray-600">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* --- Features & Benefits Section --- */}
                        <section className="py-16 sm:py-24 bg-gray-50">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-16">
                                    Powerful, Real-Time Detection
                                </h2>
                                <div className="space-y-16">
                                    {/* Feature 1: Image Analysis */}
                                    <div className="flex flex-col lg:flex-row items-center lg:space-x-12">
                                        <div className="lg:w-1/2">
                                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Instant Image Analysis</h3>
                                            <p className="text-lg text-gray-600 mb-6">
                                                Upload any image format and get immediate results. Our system processes the image using your selected model, returning a result with clear bounding boxes and **recognition labels** overlaid on the original media. Perfect for rapid testing and verification.
                                            </p>
                                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                                <li>Quick file upload and preview.</li>
                                                <li>Real-time progress updates via the progress bar.</li>
                                                <li>High-accuracy face/object recognition.</li>
                                            </ul>
                                        </div>
                                        <div className="lg:w-1/2 mt-8 lg:mt-0 relative">
                                            <div className="p-8 bg-white rounded-xl shadow-2xl border border-indigo-200">
                                                <div className="h-64 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-400 text-sm font-medium">
                                                    [Placeholder: Analyzed Image with Bounding Boxes]
                                                </div>
                                            </div>
                                            <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-green-400 p-3 rounded-full shadow-xl animate-bounce duration-500">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.009 12.009 0 003 12c0 2.755 1.498 5.244 3.864 6.643L7 21h10l.136-2.357C19.502 17.244 21 14.755 21 12a12.009 12.009 0 00-.382-3.016z"></path></svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Feature 2: Video Analysis */}
                                    <div className="flex flex-col lg:flex-row-reverse items-center lg:space-x-reverse lg:space-x-12">
                                        <div className="lg:w-1/2">
                                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Robust Video Processing</h3>
                                            <p className="text-lg text-gray-600 mb-6">
                                                For larger files, we first handle the **video upload** securely. The analysis runs in the background, providing you with **continuous progress updates** via the progress bar. Once complete, the analyzed video is ready to play directly in the dashboard preview.
                                            </p>
                                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                                <li>Secure, scalable video file uploads.</li>
                                                <li>Live detection events streamed via WebSocket.</li>
                                                <li>Supports common video formats (MP4, MOV).</li>
                                            </ul>
                                        </div>
                                        <div className="lg:w-1/2 mt-8 lg:mt-0 relative">
                                            <div className="p-8 bg-white rounded-xl shadow-2xl border border-indigo-200">
                                                <div className="h-64 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-400 text-sm font-medium">
                                                    [Placeholder: Video Player Interface]
                                                </div>
                                            </div>
                                            <div className="absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2 bg-red-400 p-3 rounded-full shadow-xl animate-ping opacity-75"></div>
                                            <div className="absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2 bg-red-600 p-3 rounded-full shadow-xl">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18H3a2 2 0 01-2-2V8a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H5z"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        
                        {/* --- Final CTA Section --- */}
                        <section className="bg-black py-16">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                                <h2 className="text-4xl font-extrabold text-white">
                                    Ready to see your models in action?
                                </h2>
                                <p className="mt-4 text-xl text-indigo-100 max-w-2xl mx-auto">
                                    Head over to the Dashboard to upload your first image or video and start your analysis now.
                                </p>
                                <a 
                                    href="#" 
                                    className="mt-8 inline-block px-12 py-4 text-lg font-bold text-indigo-600 bg-white rounded-full shadow-2xl hover:bg-gray-100 transition duration-300 transform hover:scale-105"
                                >
                                    Go to Dashboard
                                </a>
                            </div>
                        </section>
                    </main>

                    <Footer />
                </Fragment>
            )}
            
            {/* Custom keyframe styles for animations */}
            <style>
                {`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .animate-spin {
                        animation: spin 1s linear infinite;
                    }
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-slide-up {
                        animation: slideUp 0.6s ease-out forwards;
                    }
                    /* Standard Tailwind-like animation definitions */
                    .animate-pulse {
                        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                    }
                    .animate-bounce {
                        animation: bounce 1s infinite;
                    }
                    .animate-ping {
                        animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
                    }
                `}
            </style>
        </Fragment>
    );
};


// Exporting the application as app
export default Home;
