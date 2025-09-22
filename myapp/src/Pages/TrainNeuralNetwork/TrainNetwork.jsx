// Importing the necessary modules 
import React, { Fragment, useEffect, useRef, useState  } from 'react'; 
import DashboardNavbar from '../../Components/Navbar/DashboardNavbar';
import Footer from '../../Components/Footer/Footer';
import trainImageDisplay from "../../Images/trainImage.jpg"; 

// Creating the TrainNeuralNetwork component 
const TrainNeuralNetwork = () => {
    // Setting the state variables 
    const [loading, setLoading] = useState(true);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [selectedAnnotationFile, setSelectedAnnotationFile] = useState(null);
    const fileInputRef = useRef(null);

    // Creating a fuction to handle file selection 
    const handleImageFileChange = (event) => {
        setSelectedImageFile(event.target.files[0]);
    }; 

    // Creating a function to handle the file selection for xml or txt file 
    const handleAnnotationFileChange = (event) => {
        setSelectedAnnotationFile(event.target.files[0]);
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
            <div className="container min-h-screen p-30 mx-auto my-10 mt-[110px] mb-[300px]">
                <div className="flex justify-center mb-[50px]">
                    <div> 
                        <h1 className="text-3xl font-bold mb-4">Train Neural Network</h1>
                        <p className="mb-4">This is where you can train the machine's Neural Network model on the <b className="text-[18px] ml-[7px]"> missing person's image.  </b>  <br/> 
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
                        <img src={trainImageDisplay} alt="Train Neural Network" className="w-[100%] h-[65%] rounded-lg mt-[20px] mb-[20px]"/>
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

                    {/* File input field for the pascal/yolo xml or .txt file for training 
                    the model neural network  */}
                    <div className="mb-4"> 
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image-upload">
                            Choose File Annotations (XML or TXT):
                        </label>
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
                        className="border border-[#d4d3d3] outline outline-white p-[20px] h-[165px] w-[38%]"
                        rows="4"
                        placeholder="Enter annotations class here, e.g (missing person's name, Sarah, Mike, Steff)..."
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