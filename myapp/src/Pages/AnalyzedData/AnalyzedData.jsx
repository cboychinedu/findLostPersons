// Importing the necessasry modules
import Footer from "@components/Footer/Footer";
import { Fragment, useState, useEffect } from 'react'; 
import DashboardNavbar from '@components/Navbar/DashboardNavbar';
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

    // Define the async function for the fetch request
    const postImageHistoryData = async () => {
        const URL = `${process.env.REACT_APP_MACHINE_LEARNING_SERVER}/history/analyzedImageHistory`; 

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
            setStatusMessage("Successfully fetched history data!");
            // 💡 You would typically call your flashMessageFunction here

        } catch (error) {
            // Log and set an error message in case of failure
            console.error("Error during POST request:", error);
            setStatusMessage(`Failed to fetch data: ${error.message}`);
            // 💡 You would typically call your flashMessageFunction here

        } finally {
            // Set loading state to false once the request is complete (success or failure)
            setIsLoading(false);
        }
    };

    // Creating a function to load the video history
    const postVideoHistoryData = async () => {
        const URL = `${process.env.REACT_APP_MACHINE_LEARNING_SERVER}/history/analyzedVideoHistory`;
        
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
            setStatusMessage("Successfully fetched the history data for videos!"); 

        }

        // Catch the error 
        catch (error) {
            // Log and set the error message in case of failure 
            console.error("Error during POST request: ", error); 
            setStatusMessage("Failed to fetch data", error.message); 
        }

        // Finally 
        finally {
            // Set the loading state to false 
            setIsLoading(false); 
        }
    }

    // 👇 Function to make the POST request on component mount
    useEffect(() => {
        // Execute the image history function
        postImageHistoryData();

        // Execute the video history function 
        postVideoHistoryData(); 

    }, []);

    // Rendering the analyzed history data
    return (
        <Fragment>
            {/* Adding the dashboard */}
            <DashboardNavbar />

            {/* Setting a container to hold all the analyzed history data */}
            <div className="container h-[fit-content] mb-[100px] mt-[56px] mx-auto p-4">

                <h2 className="text-2xl font-bold mb-4">Analyzed Data History</h2>

                {/* Displaying the status message or loading state */}
                {isLoading && <p>Loading history data...</p>}
                {!isLoading && statusMessage && <p className="mb-4">Status: {statusMessage}</p>}

                {/* Conditional rendering based on fetched data */}
                {!isLoading && (imagehistoryData || videohistoryData) && (
                    
                    // Flex Container for the two main columns (Image and Video)
                    <div className="flex flex-wrap lg:flex-nowrap gap-6">

                        {/* Image History Column */}
                        {imagehistoryData && (
                            <div className="p-4 border rounded-lg shadow-md bg-white overflow-y-auto max-h-[50vh] w-[70%]">
                                <h3 className="text-xl font-semibold mb-3 border-b pb-2">Image Analysis History</h3>
                                <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(imagehistoryData, null, 2)}</pre>
                            </div>
                        )}

                        {/* Video History Column */}
                        {videohistoryData && (
                            <div className="w-full w-[70%] p-4 border rounded-lg shadow-md bg-white overflow-y-auto max-h-[50vh]">
                                <h3 className="text-xl font-semibold mb-3 border-b pb-2">Video Analysis History</h3>
                                <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(videohistoryData, null, 2)}</pre>
                            </div>
                        )}

                        {/* Fallback for no data */}
                        {(!imagehistoryData && !videohistoryData) && (
                            <p className="w-full text-center text-gray-500">No analyzed image or video history found.</p>
                        )}
                    </div>
                )}

                {/* The FlashMessage component would likely be rendered here or within your layout */}
                {/* {statusMessage && flashMesageFunction(statusMessage, "success/error/info")} */}
            </div>
            {/* Adding the footer */}
            <Footer />
        </Fragment>
    )
}

// Exporting the component
export default AnalyzedHistoryData;