// Importing the necessary modules 
import "./TrainNeuralNetwork.css";
import React, { Fragment, useEffect, useRef, useState } from 'react';
import DashboardNavbar from '../../Components/Navbar/DashboardNavbar';
import Footer from '../../Components/Footer/Footer';
import trainImageDisplay from "../../Images/trainImage.jpg";
import flashMessageFunction from '../../Components/FlashMessage/FlashMessage';

// Creating the TrainNeuralNetwork component 
const TrainNeuralNetwork = () => {
    // Setting the state variables 
    const [statusMessage, setStatusMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);
    const [zipImageFile, setZipImageFile] = useState(null);
    const [labels, setLabels] = useState(null); 
    const [trainingProgress, setTrainingProgress] = useState(0);
    const [isTraining, setIsTraining] = useState(false);

    // Getting the flash message div element from the DOM using its ID.
    const flashMessageDiv = document.querySelector("#flashMessageDiv");

    // Getting the token value
    let tokenValue = localStorage.getItem("xAuthToken") || null;

    // useEffect hook to handle initial loading state
    useEffect(() => {
        // Simulating a loading process
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // Creating a function to handle the zip file selection for the image
    const handleZipImageFileChange = (event) => {
        // Getting the selected image file 
        const zipImageFileDocument = event.target.files[0];
        
        // Setting the image file to the state variable 
        setZipImageFile(zipImageFileDocument);
    };

    // Creating a function to handle the label selection 
    const handleLabelChange = (event) => {
        // Getting the selected label data 
        const labelData = event.target.value; 
        console.dir(labelData); 

        // Setting the label state 
        setLabels(labelData); 
    }; 

    // Creating a function to handle the training process
    const handleTrainModel = async (event) => {
        // Preventing the default form submission behavior 
        event.preventDefault();

        // Checking if both image and annotation files are selected
        if (!zipImageFile) {
            // Setting the flash message to display the error 
            setStatusMessage("Please select a zipped image files.");
            flashMessageFunction(flashMessageDiv, statusMessage);

            // Stopping the function's execution. 
            return;
        }

        // Checking if the labels data is missing 
        else if (!labels) {
            // Setting the flash message to display the error message 
            setStatusMessage("Please type the name of the missing person (label)."); 
            flashMessageFunction(flashMessageDiv, statusMessage)
        }

        // if all validation pass, execute the training process
        // and execute the block of code below. 
        else {
            // Set training to true and progress to 0 to show the progress bar
            setIsTraining(true);
            setTrainingProgress(0);

            // Creating a FormData object to send the files to the server 
            const formData = new FormData();
            formData.append("zipImageFile", zipImageFile);
            formData.append("labels", labels);

            // Here's where you would make an API call.
            // For demonstration, we'll simulate progress.
            const simulateProgress = setInterval(() => {
                setTrainingProgress(prevProgress => {
                    const newProgress = prevProgress + 10;
                    return newProgress > 90 ? 90 : newProgress; // Stop at 90% to show final step
                });
            }, 500); // Update every 0.5 seconds

            // Setting the server url 
            const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://127.0.0.1:3001/trainModel/';

            // Setting the headers 
            const headers = {
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS,PUT,DELETE'
            }


            // Sending the files to the server for training
            fetch(serverUrl, {
                    method: "POST",
                    body: formData,
                    headers: headers
                })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data); 

                    // Stop the progress simulation and set to 100% on success
                    // clearInterval(simulateProgress);
                    // setTrainingProgress(100);
                    // setIsTraining(false);

                    // // Display the success message to the user using flash messsage
                    // setStatusMessage("Model trained successfully!");
                    // flashMessageFunction(flashMessageDiv, "Model trained successfully!");

                    // Optionally, reset the form inputs
                    // setImageFile(null);
                    // setAnnotationFile(null);
                    // setAnnotationName(""); 

                    // Handling the server response 
                    // if (data.success) {
                    //     alert("Model trained successfully!");
                    // } else {
                    //     alert("Error training model: " + data.message);
                    // }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    // Stop the progress simulation and reset on error
                    clearInterval(simulateProgress);
                    setTrainingProgress(0);
                    setIsTraining(false);

                    // Display the error message to the user using flash messsage
                    setStatusMessage("An error occurred while training the model.");
                    flashMessageFunction(flashMessageDiv, "An error occurred while training the model.");
                });
        }

    }; 

    // Rendering the training network component 
    return (
        <Fragment>
            {/* Adding the navbar component */}
            <DashboardNavbar />

            {/* Adding the flash message  */}
            <div id="flashMessageDiv" className="
                fixed top-[4%] left-[-100%] 
                bg-green-100 border border-green-400 text-green-700 px-4 rounded 
                shadow-md transition-all duration-500 ease-in-out
                flex items-center text-left text-[16px] 
                h-[48px] pr-[92px] pt-[16px] ml-[27px] 
                border border-[#dddddd] bg-[#fffcd2] text-[#2f2727] 
                rounded-md transition-all duration-300 ease-in">
                <p className="pl-[30px]"> {statusMessage} </p>
            </div>

            {/* Adding the main div */}
            <div className="container min-h-screen p-30 mx-auto my-10 mt-[110px] mb-[300px]">
                <div className="flex justify-center mb-[50px]">
                    <div>
                        <h1 className="text-3xl font-bold mb-4">Train Neural Network</h1>
                        <p className="mb-4">This is where you can train the machine's Neural Network model on the <b className="text-[18px] ml-[7px]"> missing person's image. </b> <br />
                            <ol className="mt-[20px] list-decimal list-inside leading-[40px] ">
                                <span className=" mb-[50px]"> Firstly, get the following: </span>
                                <li> A zipped images of the missing person. Include many images for better inference. </li>
                                <li> Upload the zipped image and the into the provided file input fields below.</li>
                                <li> Type the name or label of the missing person e.g (Mark, Alan, James) </li>
                                <li> Click the "<b> Train Model </b>" button to initiate the training process.</li>
                                <li> The system will process the uploaded data and train the neural network model accordingly.</li>
                                <li> Once the training is complete, you will receive a notification indicating that the model has been successfully trained.</li>
                                <li> You can then use the trained model for facial recognition tasks related to missing persons. </li>
                            </ol>
                        </p>
                    </div>

                    <div className="w-[50%] px-[30px] pl-[100px] py-[30px]">
                        <img src={trainImageDisplay} alt="Train Neural Network" className="w-[100%] h-[65%] rounded-lg mt-[20px] mb-[20px]" />
                    </div>
                </div>

                {/* Add your image for training the model here */}
                <div className=''>
                    <h3 className="mt-[30px] mb-[10px]"> Upload zipped images of the person. </h3>
                    {/* File input field for image upload */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image-upload">
                            Choose zip files:
                        </label>
                        <input
                            type="file"
                            id="image-upload"
                             accept=".zip"
                            onChange={handleZipImageFileChange}
                            ref={fileInputRef}
                            className="border border-gray-300 p-2 rounded w-[25%]"
                        />
                    </div>
                </div>

                {/* Add your labeled annotations for traning the model  */}
                <div className='mb-[38px]'>
                    <h3 className="mb-[8px] mt-[40px]">Labeled Data </h3>
                    {/* Label description */}
                    <p className="mb-4">Add the missing person label here e.g (Mark, James, Sarah).</p>
                    {/* You can implement a form or a text area for adding annotations */}
                    <textarea
                        onChange={handleLabelChange}
                        className="border border-[#d4d3d3] outline outline-white p-[20px] h-[165px] w-[38%]"
                        rows="4"
                        placeholder="Enter annotations class here, e.g (missing person's name, Sarah, Mike, Steff)..."
                    ></textarea>
                </div>

                {/* --- Progress Bar Section --- */}
                {isTraining && (
                    <div className="mt-8 mb-4">
                        <h3 className="text-lg font-semibold mb-2">Training Progress:</h3>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className="bg-green-500 h-4 rounded-full transition-all duration-300 ease-in-out"
                                style={{ width: `${trainingProgress}%` }}
                            ></div>
                        </div>
                        <p className="text-center mt-2 font-medium">{trainingProgress}% Complete</p>
                    </div>
                )}
                
                {/* Button to trigger the training process */}
                <div>
                    <button
                        onClick={handleTrainModel}
                        disabled={isTraining} // Disable the button while training is in progress
                        className={`px-4 py-2 rounded ${isTraining ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                    >
                        {isTraining ? 'Training...' : 'Train Model'}
                    </button>
                </div>
            </div>

            {/* Adding the footer component */}
            <Footer />
        </Fragment>
    )
}

// Exporting the TrainNeuralNetwork component 
export default TrainNeuralNetwork;