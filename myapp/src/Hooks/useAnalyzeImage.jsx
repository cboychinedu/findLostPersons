// Importing the necessary modules 
import React from 'react';

/**
 * Custom hook to handle the image analysis logic.
 * It encapsulates the file reading, state updates, and socket emission.
 * @param {object} params - The parameters needed for the analysis.
 * @param {React.MutableRefObject<HTMLInputElement>} params.imageInputRef - Ref to the file input element.
 * @param {string} params.tokenValue - The user's authentication token.
 * @param {string} params.selectedModelId - The ID of the selected ML model.
 * @param {function} params.setIsProcessingImage - State setter to control image processing status.
 * @param {function} params.setImageProgress - State setter for the image progress percentage.
 * @param {function} params.setStatusMessage - State setter for the general status messages.
 * @param {function} params.setDetectionMessage - State setter for detection-specific messages.
 * @param {object} params.socket - The established socket.io connection object.
 * @returns {function} The handleAnalyzeImage function ready to be called.
 */
export const useAnalyzeImage = ({
  imageInputRef,
  tokenValue,
  selectedModelId,
  setIsProcessingImage,
  setImageProgress,
  setStatusMessage,
  setDetectionMessage,
  socket,
}) => {
  // Function to handle image analysis
  const handleAnalyzeImage = () => {
    // Check if a file is selected
    if (imageInputRef.current?.files.length > 0) {
      // NOTE: The model ID check is currently commented out in the original code,
      // but you can uncomment it here if you wish to enforce model selection.
      /*
      if (!selectedModelId) {
        setStatusMessage("Please select a trained model before analysis."); 
        return; 
      }
      */

      // Get the file
      const file = imageInputRef.current.files[0];

      // Reset states and start processing
      setIsProcessingImage(true);
      setImageProgress(0);
      setStatusMessage("Analyzing image...");
      setDetectionMessage(null); 

      // Read the file as a Data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        // Emit the data to the backend via socket
        socket.emit("analyzeImage", {
          fileData: event.target.result,
          fileName: file.name,
          token: tokenValue,
          modelId: selectedModelId, // Pass the selectedModelId
        });
      };
      
      // Start reading the file
      reader.readAsDataURL(file);

    } 
    // else 
    else {
      // If no file is selected
      setStatusMessage("Please select an image file first.");
    }
  };

  // Return the handleAnalyzeImage function 
  // so it can be used in components
  return handleAnalyzeImage;
};