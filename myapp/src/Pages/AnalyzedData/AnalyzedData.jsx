// Importing the necessasry modules  
import Footer from "@components/Footer/Footer"; 
import { Fragment, useState } from 'react';
import DashboardNavbar from '@components/Navbar/DashboardNavbar';
import flashMesageFunction from "@components/FlashMessage/FlashMessage"; 

// Creating a component to render the analyzed data by the user 
const AnalyzedHistoryData = () => {
    // Setting the state variables 
    const [statusMessage, setStatusMesage] = useState(""); 

    // Rendering the analyzed history data 
    return(
        <Fragment> 
            {/* Adding the dashboard  */}
            <DashboardNavbar /> 

            {/* Setting a container to hold all the analyzed history data  */}
            <div className="container h-[70vh] mb-[100px] mt-[56px]"> 

                <h2> Analyzed Data </h2>
            </div>
            {/* Adding the footer  */}
            <Footer /> 
        </Fragment>
    )

}

// Exporting the component 
export default AnalyzedHistoryData; 
