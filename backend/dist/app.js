"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import necessary modules and libraries 
const chalk_1 = __importDefault(require("chalk"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const homeRoutes_1 = __importDefault(require("./routes/homeRoutes"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const logger_1 = __importDefault(require("./logs/logger"));
// Setting the database url 
const databaseUri = "mongodb://localhost:27017/findLostFaces";
// Configuring the environment variables 
dotenv_1.default.config();
// Connecting to the database
mongoose_1.default.connect(databaseUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(chalk_1.default.green.bold("Connected to the database successfully"));
}).catch((err) => {
    console.log(chalk_1.default.red.bold("Error connecting to the database: ", err));
});
// Initialize Express app
const app = (0, express_1.default)();
// Middleware setup
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('combined'));
app.use((0, morgan_1.default)('combined', { stream: logger_1.default }));
// Setting the host 
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
// Routes 
app.use('/', homeRoutes_1.default);
app.use('/api', usersRoutes_1.default);
// Running the node.js server 
app.listen(PORT, HOST, () => {
    let serverInfo = chalk_1.default.red.bold(`Server is running at http://${HOST}:${PORT}`);
    console.log(serverInfo);
});
