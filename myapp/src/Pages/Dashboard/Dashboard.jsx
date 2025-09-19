// Importing the necesary modules 
import "./Dashboard.css";
import styles from "./Dashboard.module.css"; 
import { Fragment, useEffect, useState } from "react";
import { BarLoader, MoonLoader } from "react-spinners";
import DashboardNavbar from "../../Components/Navbar/DashboardNavbar";
import { Link } from "react-router-dom";
import { Table, Button } from "react-bootstrap"; 
import { AuthContext } from "../../Auth/AuthContext";
import flashMessageFunction from "../../Components/FlashMessage/FlashMessage"; 

// Rendering the Dashboard component 
const Dashboard = () => {
    // Setting the state 
    const [loading, setLoading] = useState(true); 
    const [userName, setUserName] = useState("Alan Smith");
    const [statusMessage, setStatusMessage] = useState(""); 
    const [data, setData] = useState([]);

    // Using the useEffect hook to simulate loading
    useEffect(() => {
        // Simulating a loading delay of 2 seconds
        const timer = setTimeout(() => {
            setLoading(false); // Set loading to false after 2 seconds
        }, 2000);   
        
        // Clearing the timeout 
        return () => clearTimeout(timer);
    },[]); // Empty dependency array means this runs once on mount

    // Rendering the component's UI
    return (
        <Fragment>
            {loading ? (
                // Display a loading spinner while loading is true
                <div className={styles.loaderDiv}> 
                    <MoonLoader color="blue" size="100" /> 
                </div>
            ) : (
                <div>
                {/* Adding the navbar  */}
                <DashboardNavbar />
                
                    {/* // Display the main content once loading is false  */}
                    <div className="grid align-center justify-center mt-[40px] px-[30px] py-[30px]">
                        <div className="mt-[35px]"> 
                            <h1>Dashboard</h1>
                            <p>Welcome to your dashboard! <b> {userName} </b> </p>

                            <p> 
                                To continue, click on the upload video button to select a video frame to scan for the person, then after uploading, <br /> 
                                Click on <b> Analyze Video</b> to search the video frame for missing persons. 

                            </p>
                        </div>
                        <div> 
                            {/* Adding the video display  */}
                            <video controls style={{boxShadow: "2px 5px 34px 5px"}} className="mt-[30px] mb-[33px] pt-[20px] grid justify-center text-[white] justify-center align-end rounded-[9px] bg-[black] h-[65vh] w-[100%]">
                                <source src="movie.mp4" type="video/mp4"/>
                                Your browser cannot load the video 
                            </video>
                            <div className="flex justify-flex-start my-[20px] "> 
                                <button class="mr-[17px] h-[54px] bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                    Upload Video For Analysis
                                </button>
                                <button class="bg-blue-500 h-[54px] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Analyze Video 
                                </button> 
                            </div>
                        </div>
                    </div> 
                
                </div>
 
            )}
        </Fragment>
    );
};

// Exporting the Dashboard component
export default Dashboard;