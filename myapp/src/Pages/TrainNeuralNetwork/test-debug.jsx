// Importing the necessary modules 
import "./TrainNeuralNetwork.css";
import axios from "axios";
import React, { Fragment, useEffect, useRef, useState } from 'react';
import DashboardNavbar from '../../Components/Navbar/DashboardNavbar';
import Footer from '../../Components/Footer/Footer';
import flashMessageFunction from '../../Components/FlashMessage/FlashMessage';

// Creating the TrainNeuralNetwork component 
const TrainNeuralNetwork = () => {
    // Setting the state variables 
    const [statusMessage, setStatusMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null); // Ref to access the file input element
    const [trainingProgress, setTrainingProgress] = useState(0);
    const [isTraining, setIsTraining] = useState(false);
    const [zipImageFile, setZipImageFile] = useState(null); // State for the file
    const [labels, setLabels] = useState(""); // State for the text input

    const flashMessageDiv = document.querySelector("#flashMessageDiv");
    const tokenValue = localStorage.getItem("xAuthToken") || null;

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // Function to handle the file change
    const handleFileChange = (event) => {
        // Set the selected file to state
        setZipImageFile(event.target.files[0]);
    };

    // Function to handle the labels change
    const handleLabelsChange = (event) => {
        // Set the label value to state
        setLabels(event.target.value);
    };

    // Creating a function to handle the training process
    const handleTrainModel = async (event) => {
        event.preventDefault();

        // Check if both image and labels are present from state
        if (!zipImageFile) {
            flashMessageFunction(flashMessageDiv, "Please select a zipped image file.");
            return;
        }

        if (!labels) {
            flashMessageFunction(flashMessageDiv, "Please type the name of the missing person (label).");
            return;
        }

        setIsTraining(true);
        setTrainingProgress(0);

        // Create FormData using the data from state
        const formData = new FormData();
        formData.append("file", zipImageFile);
        formData.append("labels", labels);

        // Optional: Log FormData content for debugging
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        const simulateProgress = setInterval(() => {
            setTrainingProgress(prevProgress => {
                const newProgress = prevProgress + 10;
                return newProgress > 90 ? 90 : newProgress;
            });
        }, 500);

        const serverUrl = 'http://localhost:3001/train/trainModel';

        try {
            const config = {
                headers: {
                    'x-auth-token': tokenValue,
                }
            };

            const response = await axios.post(serverUrl, formData, config);
            console.log(response.data);

            clearInterval(simulateProgress);
            setTrainingProgress(100);
            setIsTraining(false);
            setStatusMessage("Model trained successfully!");
            flashMessageFunction(flashMessageDiv, "Model trained successfully!");

            // Reset the form after success
            setZipImageFile(null);
            setLabels("");
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

        } catch (error) {
            console.error("Error:", error);
            clearInterval(simulateProgress);
            setTrainingProgress(0);
            setIsTraining(false);
            const errorMessage = (error.response?.data?.message) || error.message || "An unknown error occurred.";
            setStatusMessage(errorMessage);
            flashMessageFunction(flashMessageDiv, errorMessage);
        }
    };

    return (
        <Fragment>
            <DashboardNavbar />
            <div id="flashMessageDiv" className="...">
                <p className="pl-[30px]"> {statusMessage} </p>
            </div>
            <div className="container min-h-screen p-30 mx-auto my-10 mt-[110px] mb-[300px]">
                <div className="flex justify-center mb-[50px]">
                    <div>
                        <h1 className="text-3xl font-bold mb-4">Train Neural Network</h1>
                        <form onSubmit={handleTrainModel} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Upload Zipped Images</label>
                                <input
                                    type="file"
                                    id="zipImageFile" // Match the ID to allow `useRef` to work
                                    name="file"
                                    accept=".zip"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Enter Labels (e.g., person's name)</label>
                                <input
                                    type="text"
                                    id="labels" // Match the ID
                                    name="labels"
                                    value={labels} // Controlled component
                                    onChange={handleLabelsChange}
                                    placeholder="Enter person's name"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isTraining}
                                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                                {isTraining ? 'Training...' : 'Start Training'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default TrainNeuralNetwork;
