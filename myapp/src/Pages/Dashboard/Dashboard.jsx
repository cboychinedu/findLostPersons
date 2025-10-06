// Importing the necessary modules 
import io from "socket.io-client";
import Footer from "@components/Footer/Footer";
import { useAnalyzeImage } from "@hooks/useAnalyzeImage";
import { useAnalyzeVideo } from "@hooks/useAnalyzeVideo";
import { Fragment, useEffect, useState, useRef } from "react";
import DashboardNavbar from "@components/Navbar/DashboardNavbar";
import LoadingScreen from "@components/LoadingScreen/LoadingScreen";

// Establish socket connection once to the server
const socket = io(process.env.REACT_APP_SOCKET_URL, {
  transports: ["websocket", "polling"],
});

// Getting the token value
let tokenValue = localStorage.getItem("xAuthToken") || null;

// Creating the dashboard function component
const Dashboard = () => {
  // Setting the state
  const [loading, setLoading] = useState(true);
  const [userName, setUsername] = useState("Guest");
  const [statusMessage, setStatusMessage] = useState("");
  const [detectionMessage, setDetectionMessage] = useState(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [modelTypes, setModelTypes] = useState([]); 
  const [selectedModelId, setSelectedModelId] = useState(null);

  // Setting the refs for the image and video inputs
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Function to handle the model selection dropdown menu 
  // const handleModelSelectChange = (event) => {
  //   // Test 
  //   // console.log(event);
  //   const selectedMlModel = document.querySelector("#mlModel");   

  //   console.log("Selected Model: ", selectedMlModel.value);

  //   // Setting the selected model id value 
  //   setSelectedModelId(selectedMlModel.value); 
  // }

  // Handler for model selection
  const handleModelSelectChange = (event) => {
    const value = event.target.value;
    console.log("Selected Model:", value);

    // If "null" is chosen, store it as null
    setSelectedModelId(value === "null" ? null : value);
  };

  // Creating a function to fetch the model
  const fetchModel = async () => {
    // Using try catch method 
    try {
      // if the token value is not present, set the username as guest 
      if (!tokenValue) {
        // Set the username 
        setUsername("Guest"); 

      }

      // Making a request to the backend to get the user's trained models 
      const response = await fetch(`${process.env.REACT_APP_MACHINE_LEARNING_SERVER}/train/displayModels`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${tokenValue}`, 
          "xAuthtoken": tokenValue, 
        }
      });
      
      // If there is no response, execute the block 
      // of code below 
      if (!response.ok) {
        // Log the error 
        console.log("Failed to fetch model data: ", response.status, response.statusText, response.message); 

        // Setting the status message 
        setStatusMessage(response.message); 

        // Pausing the progress 
        return; 
      }

      // Get the data and save the username 
      let modelData = await response.json(); 

      // Saving the models into the models state 
      setModelTypes(modelData || []); 

      // Set the initial selected model ID 
      if (modelData && modelData.length > 0) {
        // Set the selected model id value 
        setSelectedModelId(modelData[0]._id); 
      } 

    }

    // Catch the error 
    catch (error) {
      // On error connecting to the server, execute 
      // the block of code below 
      setStatusMessage("Error fetching the model data: ", error); 
    }
  }

  // Corrected function to fetch the username from the server
  const fetchUsername = async () => {
    try {
      // If the token value is not present, set the username
      // as guest
      if (!tokenValue) {
        // Set the username
        setUsername("Guest");
        return;
      }

      // Making a request to the backend to get the user's username
      // NOTE: Replace this mock URL with your actual backend endpoint.
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/username`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenValue}`,
          "token": tokenValue,
        }
      });

      // If there is no response, set the username to an error state
      if (!response.ok) {
        // Log the error, and set the username as guest
        console.error("Failed to fetch username:", response.status, response.statusText);
        setUsername("Guest");
        return;
      }

      // Get the data and save the user name
      let data = await response.json();
      setUsername(data.userName);
    } 
    // Catching the error
    catch (error) {
      // On error to the server, execute the block of code below
      console.error("Error fetching the username:", error);
      // Set the username as guest
      setUsername("Guest");
    }
  };

  // Socket event listeners
  useEffect(() => {
    // Fetch the username on component mount
    fetchUsername();

    // Fetch the model data on component mount 
    fetchModel(); 

    // Socket event listeners
    socket.on("connect", () => {
      console.log("Connected to server via WebSocket");
    });

    // Progress update event handling
    socket.on("progress", (data) => {
      const newProgress = parseFloat(data.data);
      if (data.type === "image") {
        setImageProgress(newProgress);
        if (newProgress >= 100) {
          setIsProcessingImage(false);
        }
      } else if (data.type === "video") {
        setVideoProgress(newProgress);
        if (newProgress >= 100) {
          setIsProcessingVideo(false);
        }
      }
    });

    // Analysis complete event handling
    socket.on("analysisComplete", (data) => {
      console.log("Analysis completed:", data);
      if (data.type === "image") {
        setImagePreviewUrl(data.resultUrl);
        setStatusMessage("Image analysis complete!");
        setImageProgress(100);
        setIsProcessingImage(false);
      } 
      // Corrected video analysis logic.
      // The state update is sufficient to trigger a re-render of the component
      // and update the video element. Direct DOM manipulation is not needed.
      else if (data.type === "video") {
        setVideoPreviewUrl(data.resultUrl);
        setStatusMessage("Video analysis complete!");
        setVideoProgress(100);
        setIsProcessingVideo(false);
      }
    });

    // Detection event handling
    socket.on("detectionEvent", (data) => {
      setDetectionMessage(data.message);
    });

    // Analysis error handling
    socket.on("analysisError", (data) => {
      console.error("Analysis error:", data);
      setStatusMessage("Error: " + data.message);
      setIsProcessingImage(false);
      setIsProcessingVideo(false);
      setImageProgress(0);
      setVideoProgress(0);
    });

    // Cleanup function for the effect
    return () => {
      socket.off("connect");
      socket.off("progress");
      socket.off("analysisComplete");
      socket.off("analysisError");
      socket.off("detectionEvent");
    };
  }, []);

  // Fake loading screen
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // File input triggers
  const handleImageUploadButtonClick = () => {
    if (isProcessingImage || isProcessingVideo) {
      setStatusMessage("Cannot upload while analysis is in progress.");
      return;
    }
    imageInputRef.current.click();
  };

  // Video upload button click handler
  const handleVideoUploadButtonClick = () => {
    if (isProcessingImage || isProcessingVideo) {
      setStatusMessage("Cannot upload while analysis is in progress.");
      return;
    }
    videoInputRef.current.click();
  };

  // File selection
  const onImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreviewUrl(URL.createObjectURL(file));
      setStatusMessage("Image selected, ready for analysis.");
    }
  };

  const onVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoPreviewUrl(URL.createObjectURL(file));
      setStatusMessage("Video selected, ready for analysis.");
    }
  };
  
  // Using the custom hook for image analysis
  const handleAnalyzeImage = useAnalyzeImage({
      imageInputRef,
      tokenValue,
      selectedModelId,
      setIsProcessingImage,
      setImageProgress,
      setStatusMessage,
      setDetectionMessage,
      socket,
  });

  // Using the custom hook for video analysis 
  const handleAnalyzeVideo = useAnalyzeVideo({
    videoInputRef,
    tokenValue,
    selectedModelId,
    setIsProcessingVideo,
    setVideoProgress,
    setStatusMessage,
    setDetectionMessage,
    socket,
  });


  // Rendering the dashboard component
  return (
    <Fragment>
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
          <DashboardNavbar />

          <div className="container mx-auto p-4 md:p-8">
            <header className="text-left my-8 mt-[160px]">
              <h1 className="text-4xl font-extrabold text-gray-900">Analysis Dashboard</h1>
              <p className="mt-2 text-lg text-gray-600">
                Welcome, <b>{userName}</b>. Upload media for analysis.
              </p>

              {/* Adding a selection tag to selected the trained ml model */}
              {/* Adding a selection tag to select the trained ML model */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-inner"> 
                <label htmlFor="mlModel" className="font-semibold text-gray-700 block mb-2">
                  Choose a trained machine learning model: 
                </label>
                  <select 
                    name="mlModel" 
                    id="mlModel" 
                    value={selectedModelId ?? "null"}  // fallback to "null" if nothing is selected
                    onChange={handleModelSelectChange}
                    className="h-10 w-full md:w-1/2 border border-gray-300 rounded-lg p-2 bg-white focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  >
                    <option value="null">Select a model</option>

                    {Array.isArray(modelTypes) && modelTypes.length > 0 ? (
                      modelTypes.map((model) => (
                        <option 
                          key={model._id?.$oid || model._id} 
                          value={model._id?.$oid || model._id}
                        >
                          {model.labels || "Unnamed Model"}
                        </option>
                      ))
                    ) : (
                      <option value="null" disabled>
                        No models available
                      </option>
                    )}
                  </select>
              </div>

              {/* Adding the status message */}
              {statusMessage && (
                <p className="mt-4 p-3 bg-blue-100 border-l-4 border-blue-500 text-blue-800 rounded">{statusMessage}</p>
              )}
              {detectionMessage && (
                <p className="mt-2 p-3 bg-red-100 border-l-4 border-red-500 text-red-800 rounded">{detectionMessage}</p>
              )}
            </header>

            {/* Grid layout remains 1 column on small screens, 2 columns on medium screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
              {/* Image Analysis Section */}
              <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-200">
                <h2 className="text-2xl font-semibold mb-4 text-center text-gray-900">
                  Image Analysis
                </h2>
                {/* Media Preview Area */}
                <div className="flex justify-center h-80 w-full bg-gray-900 rounded-lg shadow-inner overflow-hidden border-2 border-indigo-300">
                  {imagePreviewUrl ? (
                    <img
                      src={imagePreviewUrl}
                      alt="Analyzed preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="grid place-items-center text-gray-400">
                      Upload an image file (.jpg, .png)
                    </div>
                  )}
                </div>
                
                {/* Image Buttons: Made them wrap on small screens and full width if needed */}
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  <button
                    onClick={handleImageUploadButtonClick}
                    // Added w-full sm:w-auto to make the button stretch on very small screens
                    className="h-12 w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105"
                    disabled={isProcessingImage || isProcessingVideo}
                  >
                    Upload Image
                  </button>
                  <button
                    onClick={handleAnalyzeImage}
                    disabled={!imagePreviewUrl || isProcessingImage || isProcessingVideo}
                    // Added w-full sm:w-auto to make the button stretch on very small screens
                    className={`h-12 w-full sm:w-auto font-bold py-2 px-6 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 ${
                      imagePreviewUrl && !isProcessingImage && !isProcessingVideo
                        ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                        : "bg-gray-400 text-gray-700 cursor-not-allowed"
                    }`}
                  >
                    Analyze Image
                  </button>
                  <input
                    type="file"
                    hidden
                    accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                    ref={imageInputRef}
                    onChange={onImageFileChange}
                  />
                </div>
                {isProcessingImage && (
                  <div className="w-full mt-8 mx-auto">
                    <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${imageProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-center mt-2 text-sm text-gray-600">
                      Processing... {imageProgress.toFixed(2)}%
                    </p>
                  </div>
                )}
              </div>

              {/* Video Analysis Section */}
              <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-200">
                <h2 className="text-2xl font-semibold mb-4 text-center text-gray-900">
                  Video Analysis
                </h2>
                {/* Media Preview Area */}
                <div className="flex justify-center h-80 w-full bg-gray-900 rounded-lg shadow-inner overflow-hidden border-2 border-indigo-300">
                  {videoPreviewUrl ? (
                    <video 
                      key={videoPreviewUrl} 
                      controls 
                      className="w-full h-full object-contain"
                      src={videoPreviewUrl}
                      id="videoPreview"
                    >
                      Your browser cannot load the video.
                    </video>
                  ) : (
                    <div className="grid place-items-center text-gray-400">
                      Upload a video file (.mp4, .mov)
                    </div>
                  )}
                </div>
                
                {/* Video Buttons: Made them wrap on small screens and full width if needed */}
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  <button
                    onClick={handleVideoUploadButtonClick}
                    // Added w-full sm:w-auto
                    className="h-12 w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105"
                    disabled={isProcessingImage || isProcessingVideo}
                  >
                    Upload Video
                  </button>
                  <button
                    onClick={handleAnalyzeVideo}
                    disabled={!videoPreviewUrl || isProcessingImage || isProcessingVideo}
                    // Added w-full sm:w-auto
                    className={`h-12 w-full sm:w-auto font-bold py-2 px-6 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 ${
                      videoPreviewUrl && !isProcessingVideo && !isProcessingImage
                        ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                        : "bg-gray-400 text-gray-700 cursor-not-allowed"
                    }`}
                  >
                    Analyze Video
                  </button>
                  <input
                    type="file"
                    hidden
                    accept="video/*"
                    ref={videoInputRef}
                    onChange={onVideoFileChange}
                  />
                </div>
                {isProcessingVideo && (
                  <div className="w-full mt-8 mx-auto">
                    <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${videoProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-center mt-2 text-sm text-gray-600">
                      Processing... {videoProgress.toFixed(2)}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Footer /> 
        </div>


      )}
    </Fragment>
  );
};

// Exporting the dashboard component
export default Dashboard;