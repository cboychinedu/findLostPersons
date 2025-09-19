"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing the necessary modules 
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Create a write stream (in append mode) for the log file 
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(__dirname, 'requests.log'), { flags: 'a' });
// Exporting the logger module 
exports.default = accessLogStream;
