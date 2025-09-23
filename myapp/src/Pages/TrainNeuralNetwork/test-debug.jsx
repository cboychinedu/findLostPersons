// Importing the necessary modules 
import React, { Fragment, useEffect, useRef, useState } from 'react';
import DashboardNavbar from '../../Components/Navbar/DashboardNavbar';
import Footer from '../../Components/Footer/Footer';
import trainImageDisplay from "../../Images/trainImage.jpg";

// Creating the TrainNeuralNetwork component 
const TrainNeuralNetwork = () => {
    // Setting the state variables 
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);
    const [imageFile, setImageFile] = useState(null);
    const [annotationFile, setAnnotationFile] = useState(null);
    // New state to track training progress (0-100)
    const [trainingProgress, setTrainingProgress] = useState(0);
    // New state to check if training is in progress
    const [isTraining, setIsTraining] = useState(false);

    // useEffect hook to handle initial loading state
    useEffect(() => {
        // Simulating a loading process
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // Creating a function to handle file selection for the image
    const handleImageFileChange = (event) => {
        // Getting the selected image file 
        const imageFileDocument = event.target.files[0];
        // Setting the image file to the state variable 
        setImageFile(imageFileDocument);
    };

    // Creating a function to handle the file selection for xml or txt file 
    const handleAnnotationFileChange = (event) => {
        // Getting the selected annotation file 
        const annotationFileDocument = event.target.files[0];
        // Setting the annotation file to the state variable 
        setAnnotationFile(annotationFileDocument);
    };

    // Creating a function to handle the training process
    const handleTrainModel = (event) => {
        // Preventing the default form submission behavior 
        event.preventDefault();

        // Checking if both image and annotation files are selected
        if (!imageFile || !annotationFile) {
            alert("Please select both image and annotation files.");
            return;
        }

        // Set training to true and progress to 0 to show the progress bar
        setIsTraining(true);
        setTrainingProgress(0);

        // Creating a FormData object to send the files to the server 
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("annotation", annotationFile);

        // Here's where you would make an API call.
        // For demonstration, we'll simulate progress.
        const simulateProgress = setInterval(() => {
            setTrainingProgress(prevProgress => {
                const newProgress = prevProgress + 10;
                return newProgress > 90 ? 90 : newProgress; // Stop at 90% to show final step
            });
        }, 500); // Update every 0.5 seconds

        // Sending the files to the server for training
        fetch("/trainNetwork/train", {
                method: "POST",
                body: formData,
            })
            .then((response) => response.json())
            .then((data) => {
                // Stop the progress simulation and set to 100% on success
                clearInterval(simulateProgress);
                setTrainingProgress(100);
                setIsTraining(false);

                // Handling the server response 
                if (data.success) {
                    alert("Model trained successfully!");
                } else {
                    alert("Error training model: " + data.message);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                // Stop the progress simulation and reset on error
                clearInterval(simulateProgress);
                setTrainingProgress(0);
                setIsTraining(false);
                alert("An error occurred while training the model.");
            });
    }

    // Rendering the training network component 
    return (
        <Fragment>
            {/* Adding the navbar component */}
            <DashboardNavbar />

            {/* Adding the main div */}
            <div className="container min-h-screen p-30 mx-auto my-10 mt-[110px] mb-[300px]">
                <div className="flex justify-center mb-[50px]">
                    <div>
                        <h1 className="text-3xl font-bold mb-4">Train Neural Network</h1>
                        <p className="mb-4">This is where you can train the machine's Neural Network model on the <b className="text-[18px] ml-[7px]"> missing person's image. </b> <br />
                            <ol className="mt-[20px] list-decimal list-inside leading-[40px] ">
                                <span className=" mb-[50px]"> Firstly, get the following: </span>
                                <li> An image of the missing person. </li>
                                <li> The labeled annotations for the image in either Pascal VOC XML format or YOLO TXT format.</li>
                                <li> Upload the image and the corresponding labeled annotations using the provided file input fields below.</li>
                                <li> Click the "<b> Train Model </b>" button to initiate the training process.</li>
                                <li> The system will process the uploaded data and train the neural network model accordingly.</li>
                                <li> Once the training is complete, you will receive a notification indicating that the model has been successfully trained.</li>
                                <li> You can then use the trained model for object detection tasks related to missing persons.</li>
                            </ol>
                        </p>
                    </div>

                    <div className="w-[50%] px-[30px] pl-[100px] py-[30px]">
                        <img src={trainImageDisplay} alt="Train Neural Network" className="w-[100%] h-[65%] rounded-lg mt-[20px] mb-[20px]" />
                    </div>
                </div>

                {/* Add your image for training the model here */}
                <div className=''>
                    <h2 className="mt-[30px] mb-[10px]">Upload Image for Object Detection Training</h2>
                    {/* File input field for image upload */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image-upload">
                            Choose Image:
                        </label>
                        <input
                            type="file"
                            id="image-upload"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            ref={fileInputRef}
                            className="border border-gray-300 p-2 rounded w-[25%]"
                        />
                    </div>
                </div>

                {/* Add your labeled annotations for traning the model  */}
                <div className='mb-[38px]'>
                    <h2 className="mb-[8px] mt-[40px]">Labeled Annotations</h2>
                    {/* File input field for the pascal/yolo xml or .txt file for training the model neural network  */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="annotation-upload">
                            Choose File Annotations (XML or TXT):
                        </label>
                        <input
                            type="file"
                            id="annotation-upload"
                            accept=".xml, .txt"
                            onChange={handleAnnotationFileChange} // Added the onChange handler here
                            className="border border-gray-300 p-2 rounded w-[25%]"
                        />
                    </div>
                    {/* Label description */}
                    <p className="mb-4">Add labeled annotations for the uploaded image here.</p>
                    {/* You can implement a form or a text area for adding annotations */}
                    <textarea
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