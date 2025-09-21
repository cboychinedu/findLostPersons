// Import necessary modules and libraries 
import chalk from "chalk"; 
import express from 'express';  
import cors from 'cors'; 
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongodb from 'mongoose'; 
import home from './routes/homeRoutes'; 
import users from './routes/usersRoutes'; 
import accessLogStream from './logs/logger'; 

// Setting the database url 
const databaseUri:string = "mongodb://localhost:27017/findLostFaces"; 

// Configuring the environment variables 
dotenv.config(); 

// Connecting to the database
mongodb.connect(databaseUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(chalk.green.bold("Connected to the database successfully"));
}).catch((err) => {
    console.log(chalk.red.bold("Error connecting to the database: ", err));
});

// Initialize Express app
const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(morgan('combined', { stream: accessLogStream}));

// Setting the host 
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

// Routes 
app.use('/', home); 
app.use('/api', users); 

// Running the node.js server 
app.listen(PORT, HOST, () => {
    let serverInfo = chalk.red.bold(`Server is running at http://${HOST}:${PORT}`);
    console.log(serverInfo);
});