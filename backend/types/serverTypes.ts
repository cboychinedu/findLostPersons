// Creating a type alias for the error message 
type ErrorMessage = {
    message: string; 
    status: string; 
    statusCode: number; 
}

// Creatin a type alias for the success data 
type successData = {
    email: string; 
    userName: string; 
    statusCode: number; 
}

// Exporting the types 
export type {
    ErrorMessage,
    successData,
}