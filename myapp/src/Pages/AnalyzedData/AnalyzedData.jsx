// Importing the necessasry modules
import Footer from "@components/Footer/Footer";
import { Fragment, useState, useEffect, useRef } from 'react';
import DashboardNavbar from '@components/Navbar/DashboardNavbar';
import RenderImages from "@components/DisplayHistoryImages/DisplayHistoryImags";
import RenderVideos from "@components/DisplayHistoryVideos/DisplayHistoryVideos";
import flashMesageFunction from "@components/FlashMessage/FlashMessage";

// Getting the token value
let tokenValue = localStorage.getItem("xAuthToken") || null;

// Creating a component to render the analyzed data by the user
const AnalyzedHistoryData = () => {
    // Setting the state variables
    const [statusMessage, setStatusMessage] = useState("");
    const [imagehistoryData, setImageHistoryData] = useState([]);
    const [videohistoryData, setVideoHistoryData] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    
    // Use useRef to create a mutable ref object
    const flashMessageRef = useRef(null); 

    // Define the async function for the fetch request
    const postImageHistoryData = async () => {
        const URL = `${process.env.REACT_APP_MACHINE_LEARNING_SERVER}/history/analyzedImageHistory`; 
        
        // Define the success message outside the state setter
        const successMsg = "Successfully fetched history data!";

        // Using try catch block 
        try {
            // Making the POST request
            const response = await fetch(URL, {
                method: 'POST', // Specify the method as POST
                headers: {
                    'Content-Type': 'application/json',
                    'xAuthtoken': tokenValue
                },
            });

            // Check if the request was successful (status code 200-299)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Parse the JSON response body
            const data = await response.json();

            // Update state with the fetched data and a success message
            setImageHistoryData(Array.isArray(data) ? data : []);
            setStatusMessage(successMsg);
            
            // Use the ref current value and pass the direct message string
            if (flashMessageRef.current) {
                flashMesageFunction(flashMessageRef.current, successMsg, "success");
            }

        } catch (error) {
            // Log and set an error message in case of failure 
            console.error("Error during POST request:", error); 
            const errorMsg = `Failed to fetch data: ${error.message}`;
            setStatusMessage(errorMsg); 
            
            // Use the ref current value and pass the direct message string
            if (flashMessageRef.current) {
                flashMesageFunction(flashMessageRef.current, errorMsg, "error");
            }

        } 
        // finally 
        finally {
            // Set loading state to false once the request is complete (success or failure)
            setIsLoading(false);
        }
    };

    // Creating a function to load the video history
    const postVideoHistoryData = async () => {
        const URL = `${process.env.REACT_APP_MACHINE_LEARNING_SERVER}/history/analyzedVideoHistory`;
        
        const successMsg = "Successfully fetched the history data for videos!";

        // Using try catch block 
        try {
            // Making the post request 
            const response = await fetch(URL, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json;", 
                    "xAuthtoken": tokenValue
                }, 
            }); 

            // Check if the request was successful (status code 200-299)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`); 
            }

            // Parse the json response body 
            const data = await response.json(); 

            // Update the video state with the fetched data 
            setVideoHistoryData(Array.isArray(data) ? data : []);  
            setStatusMessage(successMsg); 
            
            // Use the ref current value and pass the direct message string
            if (flashMessageRef.current) {
                flashMesageFunction(flashMessageRef.current, successMsg, "success");
            }

        } 
        // Catch the error 
        catch (error) {
            // Log and set the error message in case of failure 
            console.error("Error during POST request: ", error); 
            const errorMsg = `Failed to fetch data: ${error.message}`;
            setStatusMessage(errorMsg); 
            
            // Use the ref current value and pass the direct message string
            if (flashMessageRef.current) {
                flashMesageFunction(flashMessageRef.current, errorMsg, "error");
            }
        } 
        // finally 
        finally {
            // Set the loading state to false 
            // NOTE: Only set to false if the image fetch has also completed, 
            // but for simplicity, we'll keep it here as is.
        }
    }

    // Function to make the POST request on component mount
    useEffect(() => {
        // Execute the history functions
        postImageHistoryData();
        postVideoHistoryData(); 
    }, []);


    // Rendering the analyzed history data
    return (
        <Fragment>
            <DashboardNavbar />

            {/* Adding the flash message */}
            <div
                ref={flashMessageRef} // Attach the ref here
                id="flashMessageDiv" // Keeping ID for external reference if needed
                className="
                fixed top-[4%] left-[-100%] 
                flex items-center text-left text-[16px] 
                h-[48px] pr-[92px] pt-[16px] ml-[27px] 
                border border-[#dddddd] bg-[#fffcd2] text-[#2f2727] 
                rounded-md transition-all duration-300 ease-in
                "
            >
                <p className="pl-[30px]"> {statusMessage} </p>
            </div> 

            {/* Setting a container to hold all the analyzed history data */}
            <div className="container h-auto mx-auto p-4 pt-[100px] lg:pt-[200px] pb-24 min-h-screen mb-[300px]">
                <h2 className="text-3xl font-extrabold mb-6 text-gray-800 border-b pb-2 mt-[200px] mb-[39px]">Analyzed Data History</h2>
                
                {/* Loading state indicator */}
                {isLoading && (
                    <div className="text-center py-10 text-lg text-gray-600">Loading history data...</div>
                )}

                {/* Conditional rendering based on fetched data */}
                {!isLoading && (
                    
                    // Main responsive container: stacks on mobile, side-by-side on large screens
                    <div className="flex flex-col lg:flex-row gap-6">

                        {/* Image History Column */}
                        {imagehistoryData && (
                            // w-full on small screen, flex-1 on large screen
                            <div className="w-full lg:flex-1 p-4 border rounded-xl shadow-xl bg-white overflow-y-auto max-h-[80vh]">
                                <h3 className="text-xl font-semibold mb-3 border-b pb-2 text-indigo-700">Image Analysis History</h3>
                                {/* Map through the image data to render the image and data */}
                                {imagehistoryData.map((data, index) => (
                                    <RenderImages data={data} index={index} key={data._id || index} />
                                ))}
                                {/* Fallback if images array is empty */}
                                {imagehistoryData.length === 0 && (
                                    <p className="text-center text-gray-500 py-4">No analyzed images to display.</p>
                                )}
                            </div>
                        )}

                        {/* Video History Column */}
                        {videohistoryData && (
                            // w-full on small screen, flex-1 on large screen
                            <div className="w-full lg:flex-1 p-4 border rounded-xl shadow-xl bg-white overflow-y-auto max-h-[80vh]">
                                <h3 className="text-xl font-semibold mb-3 border-b pb-2 text-green-700">Video Analysis History</h3>
                                {/* Map through the video data to render the video and data url */}
                                {videohistoryData.map((data, index) => (
                                    <RenderVideos data={data} index={index} key={data._id || index } /> 
                                    
                                ))}
                                {/* Fallback if videos array is empty */}
                                {videohistoryData.length === 0 && (
                                    <p className="text-center text-gray-500 py-4">No analyzed videos to display.</p>
                                )}
                            </div>
                        )}

                        {/* Fallback for no data after loading */}
                        {(!imagehistoryData && !videohistoryData) && (
                            <p className="w-full text-center text-gray-500 py-10">No analyzed image or video history found.</p>
                        )}
                    </div>
                )}
            </div>
            
            <Footer />
        </Fragment>
    )
}

// Exporting the component
export default AnalyzedHistoryData;