// Custom hook for analyzing an image using a selected model
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
  // Handler function to analyze the image
  const handleAnalyzeImage = () => {
    // Check if a file is selected in the input
    if (imageInputRef.current?.files.length > 0) {
      // If no model is selected, set status message and return
      if (selectedModelId === null) {
        // Set the status message to prompt user to select a model
        setStatusMessage("Please select a trained model before analysis."); 

        // Exit the function early
        return; 
      }

      // Get the selected file
      const file = imageInputRef.current.files[0];

      // Set processing state and reset progress and messages
      setIsProcessingImage(true);

      // Reset progress and messages
      setImageProgress(0);

      // Set status message to indicate analysis is starting
      setStatusMessage("Analyzing image...");

      // Clear any previous detection messages
      setDetectionMessage(null);  

      // Create a FileReader to read the file
      const reader = new FileReader();

      // When the file is loaded, emit the analyzeImage event with file data and other info
      reader.onload = (event) => {
        // Emit the analyzeImage event with file data and other info
        socket.emit("analyzeImage", {
          fileData: event.target.result,
          fileName: file.name,
          token: tokenValue,
          modelId: selectedModelId,
        });

        // 🔹 Timeout fallback (20 seconds)
        const timeoutId = setTimeout(() => {
          // If no response in 20 seconds, reset states and set timeout message
          setIsProcessingImage(false);

          // Reset progress
          setImageProgress(0);

          // Set timeout status message
          setStatusMessage("No faces detected or request timed out.");
        }, 2000);

        // 🔹 Listen for completion/error and clear timeout
        const clearAll = () => clearTimeout(timeoutId);

        // Listeners for analysis completion and errors
        socket.once("analysisComplete", clearAll);
        socket.once("analysisError", clearAll);
      };

      // Read the file as a data URL
      reader.readAsDataURL(file);
    } 
    // If no file is selected
    else {
      // Set the status message to prompt user to select a file
      setStatusMessage("Please select an image file first.");
    }
  };

  // Return the handler function 
  return handleAnalyzeImage;
};
