"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing the necessary modules 
const mongoose_1 = __importDefault(require("mongoose"));
// Creating the user schema
const userSchema = new mongoose_1.default.Schema({
    fullname: { type: String, required: false },
    emailAddress: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },
});
// Creating the user model
const User = mongoose_1.default.model('User', userSchema);
// Exporting the user model 
exports.default = User;
