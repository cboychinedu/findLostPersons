// The sections data 
const sections = [
    {
        title: "1. Upload Your Media",
        icon: (
            <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
            </svg>
        ),
        description: "On the **Dashboard**, use the 'Upload Image' or 'Upload Video' buttons to select your file. A preview will appear instantly below the buttons."
    },
    {
        title: "2. Select Your ML Model",
        icon: (
            <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.79 2-4 2s-4-.895-4-2 1.79-2 4-2 4 .895 4 2zm12-3c0 1.105-1.79 2-4 2s-4-.895-4-2 1.79-2 4-2 4 .895 4 2zM9 6c0 1.105-1.79 2-4 2s-4-.895-4-2 1.79-2 4-2 4 .895 4 2z"></path>
            </svg>
        ),
        description: "Choose a custom-trained model from the dropdown. This is **required** for analysis as it tells the system which dataset (e.g., specific faces) to recognize."
    },
    {
        title: "3. Run the Analysis",
        icon: (
            <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
        ),
        description: "Click the 'Analyze' button next to your media type. A **progress bar** will track the processing, and status messages will update you on progress or detection events."
    },
    {
        title: "4. Review Results",
        icon: (
            <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.009 12.009 0 003 12c0 2.755 1.498 5.244 3.864 6.643L7 21h10l.136-2.357C19.502 17.244 21 14.755 21 12a12.009 12.009 0 00-.382-3.016z"></path>
            </svg>
        ),
        description: "The analysis is complete when the progress hits 100%. The preview will update to show the media with recognition results (bounding boxes and labels) overlaid."
    }
];

// Exporting the sections data
export default sections;