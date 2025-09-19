// Creating a function for displaying the flash message 
let flashMessageFunction = (flashMesageDiv, formDiv="") => {
	// Opening the flasn mesage 
	flashMesageDiv.classList.add('open'); 

	// Remove the menu after 3 seconds 
	setTimeout(() => {
		flashMesageDiv.classList.remove('open'); 
	}, 3000); 

	// Setting the eroror 
	// formDiv.className = 'inpuForm'; 


}


// Exporting the flash message function 
export default flashMessageFunction; 