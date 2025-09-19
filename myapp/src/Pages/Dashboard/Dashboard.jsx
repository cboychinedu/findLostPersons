// Importing the necesary modules 
import "./Dashboard.css";
import styles from "./Dashboard.module.css"; 
import { Fragment, useEffect, useState } from "react";
import { BarLoader, MoonLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { Table, Button } from "react-bootstrap"; 
import { AuthContext } from "../../Auth/AuthContext";
import flashMessageFunction from "../../Components/FlashMessage/FlashMessage"; 

// Rendering the Dashboard component 
const Dashboard = () => {
    // Setting the state 
    const [loading, setLoading] = useState(true); 
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
                // Display the main content once loading is false   
                <div className={styles.contentContainer}>
                    <h1>Dashboard</h1>
                    <p>Welcome to your dashboard!</p>
                </div>
            )}
        </Fragment>
    );
};

// Exporting the Dashboard component
export default Dashboard;