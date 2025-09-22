"use strict";
/**
 * Custom CORS options configuration.
 * This configuration allows requests from a predefined list of origins,
 * and handles requests with no origin (e.g., from mobile apps or cURL).
 * It is configured to allow a set of standard HTTP methods and headers.
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Creating the cors configuration 
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile app, curl, Postman) 
        if (!origin)
            return callback(null, true);
        // Setting the allowed origins 
        const allowedOrigin = [
            "http://localhost:5000",
            "http://localhost:3000",
            "http://localhost:3001"
        ];
        // 
        if (allowedOrigin.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            // log the following instead of throwing an error 
            console.log("Blocked origin", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 200,
    preflightContinue: true,
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Access-Control-Allow-Methods',
        'access-control-allow-orign',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Headers',
        'Authorization',
        'Cache-Control',
        'token',
    ]
};
// Exporting the cors configurations 
exports.default = corsOptions;
