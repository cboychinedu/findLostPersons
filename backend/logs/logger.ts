// Importing the necessary modules 
import fs from 'fs'; 
import path from 'path'; 

// Create a write stream (in append mode) for the log file 
const accessLogStream = fs.createWriteStream(
	path.join(__dirname, 'requests.log'), 
	{ flags: 'a'}

); 

// Exporting the logger module 
export default accessLogStream; 