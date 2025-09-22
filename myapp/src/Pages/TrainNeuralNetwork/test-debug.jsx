// Importing the necessary modules 
import React, { Fragment, useEffect, useState, useRef } from 'react'; 
import DashboardNavbar from '../../Components/Navbar/DashboardNavbar';
import Footer from '../../Components/Footer/Footer';

// Creating the TrainNeuralNetwork component 
const TrainNeuralNetwork = () => {
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null); // State to hold the selected file
    const fileInputRef = useRef(null); // Ref to access the file input element

    useEffect(() => {
        // Simulating a loading process
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // Function to handle file selection
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Function to handle the training process
    const handleTrainModel = () => {
        if (selectedFile) {
            // Here you would implement the logic to upload the file and train the model
            console.log("Training model with file:", selectedFile.name);
            // Example: A function call to an API for training
            // trainModelAPI(selectedFile);
            alert(`Training initiated with file: ${selectedFile.name}`);
        } else {
            alert("Please select a file to train.");
        }
    };

    // Rendering the training network component 
    return (
        <Fragment> 
            {/* Adding the navbar component */}
            <DashboardNavbar /> 

            {/* Adding the main div */}
            <div className="container min-h-screen p-10 mx-auto my-10">
                <h1 className="text-3xl font-bold mb-4">Train Neural Network</h1>
                <p className="mb-4">This is where you can train your neural network model.</p>
                
                {loading ? (
                    <div className="text-center">
                        <p>Loading...</p>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
                        <h2 className="text-xl font-semibold mb-4">Upload Image for Object Detection Training</h2>
                        
                        {/* File input field for image upload */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image-upload">
                                Choose Image:
                            </label>
                            <input 
                                type="file" 
                                id="image-upload" 
                                accept="image/*" 
                                onChange={handleFileChange} 
                                ref={fileInputRef} 
                                className="w-full text-gray-700 py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300" 
                            />
                        </div>

                        {/* Displaying selected file name */}
                        {selectedFile && (
                            <div className="mb-4 text-sm text-gray-600">
                                Selected file: <span className="font-medium text-gray-800">{selectedFile.name}</span>
                            </div>
                        )}
                        
                        {/* Button to trigger the training */}
                        <button 
                            onClick={handleTrainModel} 
                            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                        >
                            Train Model
                        </button>
                    </div>
                )}
            </div>

            {/* Adding the footer component */}
            <Footer />
        </Fragment>
    );
};

// Exporting the TrainNeuralNetwork component 
export default TrainNeuralNetwork;