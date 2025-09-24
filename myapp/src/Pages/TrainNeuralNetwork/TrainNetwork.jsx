// Importing the necessary modules 
import "./TrainNeuralNetwork.css";
import axios from "axios";
import Footer from '@components/Footer/Footer';
import { Fragment, useEffect, useRef, useState } from 'react';
import DashboardNavbar from '@components/Navbar/DashboardNavbar';
import flashMessageFunction from '@components/FlashMessage/FlashMessage';

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

    // Setting the flash message and token values 
    const flashMessageDiv = document.querySelector("#flashMessageDiv");
    const tokenValue = localStorage.getItem("xAuthToken") || null;

    // Use effect to get the timer 
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
            setStatusMessage("Please select a zipped image file"); 
            flashMessageFunction(flashMessageDiv, "Please select a zipped image file.");
            return;
        }

        if (!labels) {
            setStatusMessage("Please type the name of the missing person. e.g (Mark, Sarah, Adam)")
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

        // Simulating the progress 
        const simulateProgress = setInterval(() => {
            setTrainingProgress(prevProgress => {
                const newProgress = prevProgress + 10;
                return newProgress > 90 ? 90 : newProgress;
            });
        }, 500);

        // Setting the server url 
        const serverUrl = `${process.env.REACT_APP_MACHINE_LEARNING_SERVER}/train/trainModel`;

        // Using try catch block 
        try {
            // Setting the header configurations
            const config = {
                headers: {
                    'x-auth-token': tokenValue,
                }
            };

            // Getting the response 
            const response = await axios.post(serverUrl, formData, config);

            // if the response data was success 
            if (response.data.status === "success") {
                // Execute the block of code if the response data was a success 
                clearInterval(simulateProgress);
                setTrainingProgress(100);

                // Set the training as false, and the model status message 
                setIsTraining(false);
                setStatusMessage("Model trained successfully!");
                flashMessageFunction(flashMessageDiv, "Model trained successfully!");

                // Reset the form after success
                setZipImageFile(null);
                setLabels("");
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
            
            // else if the response.data.status is an error 
            else {
                // Execute this block of code if the data was an error 
                // message 
                clearInterval(simulateProgress);
                setTrainingProgress(100);

                // /setting the training as false 
                setIsTraining(false) 

                // Setting the alert message 
                setStatusMessage(response.data.message);
                flashMessageFunction(flashMessageDiv, response.data.message);
            }

        } 
        // Catch the error 
        catch (error) {
            // clearing the traing progress. 
            console.error("Error:", error);
            clearInterval(simulateProgress);
            setTrainingProgress(0);
            setIsTraining(false);

            // Setting the error message 
            const errorMessage = (error.response?.data?.message) || error.message || "An unknown error occurred.";
            setStatusMessage(errorMessage);
            flashMessageFunction(flashMessageDiv, errorMessage);
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
                <div className="flex flex-col items-center space-y-10 mb-[50px]">
                    <div className="w-full">
                        <h1 className="text-3xl font-bold mb-4">Train Neural Network</h1>
                        <p> Watch the video to learn how to train the machine learning model. </p>
                        <div className="mb-[60px] mt-[10px] h-[fit-content] w-full"> 
                            {/* Adding the youtube link */}
                            <iframe 
                                className="w-[75%] h-[551px] object-contain rounded-lg shadow"
                                width="956" 
                                height="539" 
                                src="https://www.youtube.com/embed/kOd9bkh4iL8" 
                                title="zavod project" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                referrerpolicy="strict-origin-when-cross-origin" 
                                allowfullscreen>

                            </iframe>
                        </div>

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
                </div>

                {/* Add your image for training the model here */}
                <form action="/" method="post" encType="multipart/form-data" onSubmit={handleTrainModel}> 
                    <div className=''>
                        <h3 className="mt-[30px] mb-[10px]"> Upload zipped images of the person. </h3>
                        {/* File input field for image upload */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image-upload">
                                Choose zip files:
                            </label>
                            <input
                                type="file"
                                id="zipImageFile"
                                accept=".zip"
                                ref={fileInputRef}
                                onChange={handleFileChange}
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
                            id="labels" 
                            className="border border-[#d4d3d3] outline outline-white p-[20px] h-[165px] w-[38%]"
                            rows="4"
                            value={labels} // Controlled component
                            onChange={handleLabelsChange}
                            placeholder="Enter annotations class here, e.g (missing person's name, Sarah, Mike, Steff)..."
                        ></textarea>
                    </div>

                    {/* Button to trigger the training process */}
                    <div>
                        <button
                            type="submit"
                            disabled={isTraining} // Disable the button while training is in progress
                            className={`px-4 py-2 rounded ${isTraining ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                        >
                            {isTraining ? 'Training...' : 'Train Model'}
                        </button>
                    </div>
                </form>

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
                
            </div>

            {/* Adding the footer component */}
            <Footer />
        </Fragment>
    )
}

// Exporting the TrainNeuralNetwork component 
export default TrainNeuralNetwork;