// src/hooks/useAnalyzeVideo.js

/**
 * Custom hook to handle the video analysis logic.
 * It manages file validation, state updates, the video upload process, 
 * and the final socket emission to start server-side analysis.
 * * @param {object} params - The parameters needed for the analysis.
 * @param {React.MutableRefObject<HTMLInputElement>} params.videoInputRef - Ref to the file input element.
 * @param {string} params.tokenValue - The user's authentication token.
 * @param {function} params.setIsProcessingVideo - State setter to control video processing status.
 * @param {function} params.setVideoProgress - State setter for the video progress percentage.
 * @param {function} params.setStatusMessage - State setter for the general status messages.
 * @param {function} params.setDetectionMessage - State setter for detection-specific messages.
 * @param {object} params.socket - The established socket.io connection object.
 */
export const useAnalyzeVideo = ({
  videoInputRef,
  tokenValue,
  setIsProcessingVideo,
  setVideoProgress,
  setStatusMessage,
  setDetectionMessage,
  socket,
}) => {
  // Use the environment variable from the scope where the hook is used
  const ML_SERVER_URL = process.env.REACT_APP_MACHINE_LEARNING_SERVER;

  const handleAnalyzeVideo = async () => {
    const file = videoInputRef.current?.files[0];
    
    if (file) {
      // 1. Initial State Setup
      setIsProcessingVideo(true);
      setVideoProgress(0);
      setStatusMessage("Uploading video...");
      setDetectionMessage(null);

      // 2. Prepare Form Data for HTTP Upload
      const formData = new FormData();
      formData.append("file", file);

      try {
        // 3. Upload Video via HTTP POST
        const response = await fetch(`${ML_SERVER_URL}/uploadVideo`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          // Throw an error if the HTTP request failed
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // 4. Start Analysis via Socket
        setStatusMessage("Upload complete. Starting analysis...");
        socket.emit("startVideoAnalysis", {
          fileName: result.fileName, // The file name returned by the server
          token: tokenValue,
        });
        
      } catch (error) {
        // 5. Handle Errors
        console.error("Video upload failed:", error);
        setStatusMessage("Error uploading video: " + error.message);
        
        // Reset processing state on failure
        setIsProcessingVideo(false);
        setVideoProgress(0);
      }
    } else {
      // If no file is selected
      setStatusMessage("Please select a video file first.");
    }
  };

  return handleAnalyzeVideo;
};