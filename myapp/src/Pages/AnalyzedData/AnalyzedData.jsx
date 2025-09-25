// Importing the necessasry modules
import Footer from "@components/Footer/Footer";
import { Fragment, useState, useEffect } from 'react'; // 👈 Import useEffect
import DashboardNavbar from '@components/Navbar/DashboardNavbar';
import flashMesageFunction from "@components/FlashMessage/FlashMessage";

// Getting the token value
let tokenValue = localStorage.getItem("xAuthToken") || null;

// Creating a component to render the analyzed data by the user
const AnalyzedHistoryData = () => {
    // Setting the state variables
    const [statusMessage, setStatusMesage] = useState("");
    const [historyData, setHistoryData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // 👇 Function to make the POST request on component mount
    useEffect(() => {
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
                setHistoryData(data);
                setStatusMesage("Successfully fetched history data!");
                // 💡 You would typically call your flashMessageFunction here

            } catch (error) {
                // Log and set an error message in case of failure
                console.error("Error during POST request:", error);
                setStatusMesage(`Failed to fetch data: ${error.message}`);
                // 💡 You would typically call your flashMessageFunction here

            } finally {
                // Set loading state to false once the request is complete (success or failure)
                setIsLoading(false);
            }
        };

        // Execute the function
        postImageHistoryData();

    }, []);

    // Rendering the analyzed history data
    return (
        <Fragment>
            {/* Adding the dashboard */}
            <DashboardNavbar />

            {/* Setting a container to hold all the analyzed history data */}
            <div className="container h-[70vh] mb-[100px] mt-[56px]">

                <h2> Analyzed Data </h2>

                {/* Displaying the status message or loading state */}
                {isLoading && <p>Loading history data...</p>}
                {!isLoading && statusMessage && <p>Status: {statusMessage}</p>}

                {/* Conditional rendering based on fetched data */}
                {!isLoading && historyData && (
                    <pre>{/* Displaying the raw data for testing */
                        JSON.stringify(historyData, null, 2)
                    }</pre>
                    // 💡 You would map over historyData here to render the actual list
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