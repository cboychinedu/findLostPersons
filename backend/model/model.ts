// Importing the necessary modules 
import mongodb from 'mongoose';

// Creating the user schema
const userSchema = new mongodb.Schema({
    fullname: {type: String, required:false}, 
    emailAddress: { type: String, required: true, unique:true}, 
    password: {type: String, required:true}, 
    date: { type: Date, default: Date.now }, 
});

// Creating the user model
const User = mongodb.model('User', userSchema);

// Exporting the user model 
export default User;