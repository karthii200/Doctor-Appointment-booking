import express from "express";
import colors from "colors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url"; // Required for __dirname with ES Modules

// Import your route files
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import authMiddleware from "./middlewares/authMiddleware.js";

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

// Initialize the Express application
const app = express();

// Middleware
app.use(express.json()); // For parsing JSON request bodies
app.use(morgan("dev")); // For logging HTTP requests in dev format

// Define allowed origins for CORS
const allowedOrigins = [
  "https://doctor-appointment-booking-bwdo.onrender.com",
  "http://localhost:3000","http://localhost:8084",    // <--- ADD THIS LINE
  "http://localhost:8084/"   // <--- ADD THIS LINE (with trailing slash)

];

// CORS Configuration
// This is the SINGLE and CORRECT CORS block.
// It explicitly allows specified origins and methods, and handles credentials.
app.use(
  cors({
    origin: (origin, callback) => {
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allowed HTTP methods
    credentials: true, // Allow cookies to be sent
  })
);

// API Routes
// These routes handle different parts of your application (user, admin, doctor related APIs)
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/doctor", doctorRoutes);

// --- Serve Static Assets in Production (for deployment) ---
// Get __filename and __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the client's build directory
app.use(express.static(path.join(__dirname, "./client/build")));

// For any other GET request, serve the client's index.html file
// This is crucial for single-page applications (like React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// --- Server Port Configuration ---
// The server will listen on the port defined in process.env.PORT (e.g., in a .env file)
// or default to 8084 if no environment variable is set.
const PORT = process.env.PORT || 8084;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`.bgCyan.white);
});