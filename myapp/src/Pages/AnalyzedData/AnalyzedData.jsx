// Importing the necessasry modules
import Footer from "@components/Footer/Footer";
import { Fragment, useState, useEffect, useRef } from 'react'; // 👈 Import useRef
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
    const [imagehistoryData, setImageHistoryData] = useState(null);
    const [videohistoryData, setVideoHistoryData] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    
    // 💡 CORRECTION 1: Use useRef to create a mutable ref object
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
            setImageHistoryData(data);
            setStatusMessage(successMsg);
            
            // 💡 CORRECTION 2: Use the ref current value and pass the direct message string
            if (flashMessageRef.current) {
                flashMesageFunction(flashMessageRef.current, successMsg, "success"); // Assuming "success" type for flashMesageFunction
            }

        } catch (error) {
            // Log and set an error message in case of failure 
            console.error("Error during POST request:", error); 
            const errorMsg = `Failed to fetch data: ${error.message}`;
            setStatusMessage(errorMsg); 
            
            // 💡 Use the ref current value and pass the direct message string
            if (flashMessageRef.current) {
                flashMesageFunction(flashMessageRef.current, errorMsg, "error"); // Assuming "error" type
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
            setVideoHistoryData(data);  
            setStatusMessage(successMsg); 
            
            // 💡 Use the ref current value and pass the direct message string
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
            
            // 💡 Use the ref current value and pass the direct message string
            if (flashMessageRef.current) {
                flashMesageFunction(flashMessageRef.current, errorMsg, "error");
            }
        } 
        // finally 
        finally {
            // Set the loading state to false 
            setIsLoading(false); 
        }
    }

    // 👇 Function to make the POST request on component mount
    useEffect(() => {
        // Execute the history functions
        postImageHistoryData();
        postVideoHistoryData(); 
    }, []);


    // Rendering the analyzed history data
    return (
        <Fragment>
            {/* Adding the dashboard */}
            <DashboardNavbar />

            {/* Adding the flash message  */}
            {/* 💡 CORRECTION 3: Attach the ref to the div instead of using an ID for DOM query */}
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
            <div className="container h-[fit-content] mb-[60vh] mt-[125px] mx-auto p-4">

                <h2 className="text-2xl font-bold mb-4">Analyzed Data History</h2>

                {/* Conditional rendering based on fetched data */}
                {!isLoading && (imagehistoryData || videohistoryData) && (
                    
                    // Flex Container for the two main columns (Image and Video)
                    <div className="flex flex-wrap lg:flex-nowrap gap-6">

                        {/* Image History Column */}
                        {imagehistoryData && (
                            <div className="flex-1 w-full p-4 border rounded-lg shadow-md bg-white overflow-y-auto max-h-[80vh] ">
                                <h3 className="text-xl font-semibold mb-3 border-b pb-2">Image Analysis History</h3>
                                {/* Map through the image data to render the image and data */}
                                {imagehistoryData.map((data, index) => (
                                    <RenderImages data={data} index={index} key={data._id || index} />
                                ))}
                            </div>
                        )}

                        {/* Video History Column */}
                        {videohistoryData && (
                            <div className="flex-1 w-full p-4 border rounded-lg shadow-md bg-white overflow-y-auto max-h-[80vh]">
                                <h3 className="text-xl font-semibold mb-3 border-b pb-2">Video Analysis History</h3>
                                {/* Map through the video data to render the video and data url */}
                                {videohistoryData.map((data, index) => (
                                    <RenderVideos data={data} index={index} key={data._id || index } /> 
                                    
                                ))}
                            </div>
                        )}

                        {/* Fallback for no data */}
                        {(!imagehistoryData && !videohistoryData) && (
                            <p className="w-full text-center text-gray-500">No analyzed image or video history found.</p>
                        )}
                    </div>
                )}
            </div>
            {/* Adding the footer */}
            <Footer />
        </Fragment>
    )
}

// Exporting the component
export default AnalyzedHistoryData;