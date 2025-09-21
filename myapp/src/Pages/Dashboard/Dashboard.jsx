import React, { Fragment, useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import DashboardNavbar from "../../Components/Navbar/DashboardNavbar"
import Footer from "../../Components/Footer/Footer";


// Establish socket connection once
const socket = io("http://127.0.0.1:3001");

const Dashboard = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [userName, setUsername] = useState("Alan Smith");
  const [statusMessage, setStatusMessage] = useState("");
  const [detectionMessage, setDetectionMessage] = useState(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);

  // Refs
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Corrected function to fetch the username from the server
  const fetchUsername = async () => {
    try {
      // Getting the token value
      let tokenValue = localStorage.getItem("xAuthToken") || null;

      if (!tokenValue) {
        setUsername("Guest");
        return;
      }

      // Making a request to the backend to get the user's username
      // NOTE: Replace this mock URL with your actual backend endpoint.
      const response = await fetch("http://localhost:5000/api/username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenValue}`,
          "token": tokenValue,
        }
      });

      // If there is no response, set the username to an error state
      if (!response.ok) {
        console.error("Failed to fetch username:", response.status, response.statusText);
        setUsername("Error fetching username");
        return;
      }

      // Get the data and save the user name
      let data = await response.json();
 
      // Setting the username 
      setUsername(data.userName);

    } 
    
    // Catching the error 
    catch (error) {
      // On error to the server, execute the block of code below
      console.error("Error fetching the username:", error);
      setUsername("Error");
    }
  };

  // Socket event listeners
  useEffect(() => {
    // Fetch the username on component mount
    fetchUsername();

    // Socket event listeners 
    socket.on("connect", async () => {
      console.log("Connected to server via WebSocket");

    });

    // Creating a function that goes to the 
    // backend and gets the user name 
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

    socket.on("analysisComplete", (data) => {
      console.log("Analysis completed:", data);
      if (data.type === "image") {
        setImagePreviewUrl(data.resultUrl);
        setStatusMessage("Image analysis complete!");
        setImageProgress(100);
        setIsProcessingImage(false);
      } else if (data.type === "video") {
        setVideoPreviewUrl(data.resultUrl);
        setStatusMessage("Video analysis complete!");
        setVideoProgress(100);
        setIsProcessingVideo(false);
      }
    });

    socket.on("detectionEvent", (data) => {
      setDetectionMessage(data.message);
    });

    socket.on("analysisError", (data) => {
      console.error("Analysis error:", data);
      setStatusMessage("Error: " + data.message);
      setIsProcessingImage(false);
      setIsProcessingVideo(false);
      setImageProgress(0);
      setVideoProgress(0);
    });

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

  // Emit image to backend
  const handleAnalyzeImage = () => {
    if (imageInputRef.current?.files.length > 0) {
      setIsProcessingImage(true);
      setImageProgress(0);
      setStatusMessage("Analyzing image...");
      setDetectionMessage(null);

      const file = imageInputRef.current.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        socket.emit("analyzeImage", {
          fileData: event.target.result,
          fileName: file.name,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setStatusMessage("Please select an image file first.");
    }
  };

  // Emit video to backend
  const handleAnalyzeVideo = async () => {
    const file = videoInputRef.current?.files[0];
    if (file) {
      setIsProcessingVideo(true);
      setVideoProgress(0);
      setStatusMessage("Uploading video...");
      setDetectionMessage(null);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://127.0.0.1:3001/upload-video", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        setStatusMessage("Upload complete. Starting analysis...");
        socket.emit("startVideoAnalysis", {
          fileName: result.fileName,
        });
        
      } catch (error) {
        console.error("Video upload failed:", error);
        setStatusMessage("Error uploading video: " + error.message);
        setIsProcessingVideo(false);
        setVideoProgress(0);
      }
    } else {
      setStatusMessage("Please select a video file first.");
    }
  };

  // Component for the loading screen
  const LoadingScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white transition-opacity duration-500">
      <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-purple-500"></div>
      <p className="mt-4 text-xl font-semibold">Loading Dashboard...</p>
    </div>
  );

  return (
    <Fragment>
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
          <DashboardNavbar />

          <div className="container p-4 md:p-8">
            <header className="text-left my-8 mt-[60px]">
              <h1 className="text-4xl font-extrabold text-gray-900">Dashboard</h1>
              <p className="mt-2 text-lg text-gray-600">
                Welcome, <b>{userName}</b>. Upload media for analysis.
              </p>
              <p className="text-left mt-4 text-gray-500">
                The system will process your image or video and display the results below.
              </p>
              {statusMessage && (
                <p className="mt-4 font-semibold text-blue-600">{statusMessage}</p>
              )}
              {detectionMessage && (
                <p className="mt-2 font-semibold text-red-600">{detectionMessage}</p>
              )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
              {/* ---------- Image Section ---------- */}
              <div className="bg-white p-6 rounded-lg shadow-xl">
                <h2 className="text-2xl font-semibold mb-4 text-center text-gray-900">
                  Image Analysis
                </h2>
                <div className="flex justify-center h-80 w-full bg-black rounded-lg shadow-inner overflow-hidden">
                  {imagePreviewUrl ? (
                    <img
                      src={imagePreviewUrl}
                      alt="Analyzed preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="grid place-items-center text-gray-500">
                      No image selected.
                    </div>
                  )}
                </div>
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={handleImageUploadButtonClick}
                    className="h-12 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                    disabled={isProcessingImage || isProcessingVideo}
                  >
                    Upload Image
                  </button>
                  <button
                    onClick={handleAnalyzeImage}
                    disabled={!imagePreviewUrl || isProcessingImage || isProcessingVideo}
                    className={`h-12 font-bold py-2 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 ${
                      imagePreviewUrl && !isProcessingImage && !isProcessingVideo
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "bg-gray-400 text-gray-700 cursor-not-allowed"
                    }`}
                  >
                    Analyze Image
                  </button>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
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

              {/* ---------- Video Section ---------- */}
              <div className="bg-white p-6 rounded-lg shadow-xl">
                <h2 className="text-2xl font-semibold mb-4 text-center text-gray-900">
                  Video Analysis
                </h2>
                <div className="flex justify-center h-80 w-full bg-black rounded-lg shadow-inner overflow-hidden">
                  {videoPreviewUrl ? (
                    <video controls className="w-full h-full object-contain">
                      <source src={videoPreviewUrl} type="video/mp4" />
                      Your browser cannot load the video.
                    </video>
                  ) : (
                    <div className="grid place-items-center text-gray-500">
                      No video selected.
                    </div>
                  )}
                </div>
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={handleVideoUploadButtonClick}
                    className="h-12 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                    disabled={isProcessingImage || isProcessingVideo}
                  >
                    Upload Video
                  </button>
                  <button
                    onClick={handleAnalyzeVideo}
                    disabled={!videoPreviewUrl || isProcessingImage || isProcessingVideo}
                    className={`h-12 font-bold py-2 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 ${
                      videoPreviewUrl && !isProcessingVideo && !isProcessingImage
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
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

          {/* Adding the footer  */}
          <Footer /> 
        </div>


      )}
    </Fragment>
  );
};

// Exporting the application as app 
export default Dashboard;
