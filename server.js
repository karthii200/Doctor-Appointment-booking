// // const express = require("express");
// // const colors = require("colors");
// // const moragan = require("morgan");
// // const dotenv = require("dotenv");
// // const connectDB = require("./config/db");
// // const path = require("path");
// // const cors = require("cors");

// // //dotenv conig
// // dotenv.config();
// // require('dotenv').config();



// // //mongodb connection
// // connectDB();

// // //rest obejct
// // const app = express();

// // //middlewares
// // app.use(express.json());
// // app.use(moragan("dev"));


// // app.use(cors({
// //   origin: ["https://doctor-appointment-booking-bwdo.onrender.com", "http://localhost:3000"],
// //   credentials: true,
// // }));




// // //routes
// // app.use("/api/v1/user", require("./routes/userRoutes"));
// // app.use("/api/v1/admin", require("./routes/adminRoutes"));
// // app.use("/api/v1/doctor", require("./routes/doctorRoutes"));

// // //static files
// // app.use(express.static(path.join(__dirname, "./client/build")));

// // app.get("*", function (req, res) {
// //   res.sendFile(path.join(__dirname, "./client/build/index.html"));
// // });

// // //port
// // const port = process.env.PORT || 8083;
// // //listen port
// // app.listen(port, () => {
// //   console.log(
// //     `Server Running in ${process.env.NODE_ENV} Mode on port ${process.env.PORT}`
// //       .bgCyan.white
// //   );
// // });
// const express = require("express");
// const colors = require("colors");
// const morgan = require("morgan");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const path = require("path");
// const cors = require("cors");

// // Load environment variables
// dotenv.config();

// // Connect to MongoDB
// connectDB();

// // Initialize Express app
// const app = express();

// // ✅ Middleware
// app.use(express.json());
// app.use(morgan("dev"));

// // ✅ Enable CORS
// const allowedOrigins = [
//   "https://doctor-appointment-booking-bwdo.onrender.com",
//   "http://localhost:3000"
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// }));

// // ✅ Routes
// app.use("/api/v1/user", require("./routes/userRoutes"));
// app.use("/api/v1/admin", require("./routes/adminRoutes"));
// app.use("/api/v1/doctor", require("./routes/doctorRoutes"));

// // ✅ Serve static files for frontend
// app.use(express.static(path.join(__dirname, "./client/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "./client/build/index.html"));
// });

// // ✅ Start server
// const PORT = process.env.PORT || 8083;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`.bgCyan.white);
// });
import express from "express";
import colors from "colors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // Ensure this file has ES6 exports
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// ✅ Middleware
app.use(express.json());
app.use(morgan("dev"));

// ✅ Enable CORS
const allowedOrigins = [
  "https://doctor-appointment-booking-bwdo.onrender.com",
  "http://localhost:3000"
];

app.use(
  cors({
    origin: [
      "https://doctor-appointment-booking-bwdo.onrender.com",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // If using cookies/authentication headers
  })
);


// ✅ Routes
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/doctor", doctorRoutes);

// ✅ Fix path handling for ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve static files for frontend
app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// ✅ Start server
const PORT = process.env.PORT || 8083;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`.bgCyan.white);
});
