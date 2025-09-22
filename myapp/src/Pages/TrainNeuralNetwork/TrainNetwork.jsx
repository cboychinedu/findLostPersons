// Importing the necessary modules 
import React, { Fragment, useEffect, useRef, useState  } from 'react'; 
import DashboardNavbar from '../../Components/Navbar/DashboardNavbar';
import Footer from '../../Components/Footer/Footer';

// Creating the TrainNeuralNetwork component 
const TrainNeuralNetwork = () => {
    // Setting the state variables 
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    // Creating a fuction to handle file selection 
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    }; 

    // Creating a function to handle the training process
    const handleTrainModel = (event) => {
        event.preventDefault();
    }

    // Rendering the traing network component 
    return (
        <Fragment> 
            {/* Adding the navbar component  */}
            <DashboardNavbar /> 

            {/* Adding the main div  */}
            <div className="container min-h-screen p-30 mx-auto my-10 mt-[110px]">
                <h1 className="text-3xl font-bold mb-4">Train Neural Network</h1>
                <p className="mb-4">This is where you can train your neural network model.</p>
                
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
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            className="border border-gray-300 p-2 rounded w-[25%]"
                        />
                    </div>
                </div>

                {/* Add your labeled annotations for traning the model  */}
                <div className='mb-[38px]'>
                    <h2 className="mb-4">Labeled Annotations</h2>

                    {/* File input field for the pascal/yolo xml or .txt file for training 
                    the model neural network  */}
                    <div> 
                        <input 
                            type="file"
                            id="annotation-upload"
                            accept=".xml, .txt"
                            className="border border-gray-300 p-2 rounded w-[25%]"
                        />
                    </div>

                    {/* Label description */}
                    <p className="mb-4">Add labeled annotations for the uploaded image here.</p>
                    
                    {/* You can implement a form or a text area for adding annotations */}
                    <textarea
                        className="w-full border border-gray-300 p-2 rounded h-[165px] w-[38%]"
                        rows="4"
                        placeholder="Enter annotations here..."
                    ></textarea>
                </div>

                {/* Button to trigger the training process */}
                <div>
                    <button
                        onClick={handleTrainModel}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Train Model
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