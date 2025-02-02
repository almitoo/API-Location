

const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const countryRoutes = require("./routes/countryRoutes");
const locationRoutes = require("./routes/locationRoutes");
const statsRoutes = require("./routes/statsRoutes");






dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(morgan("dev")); // Log all requests
app.use(bodyParser.json()); // Parse JSON requests

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3001', // Allow requests from React frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Allow cookies if needed
}));

// MongoDB Connection
mongoose
    .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/stats", statsRoutes);







// Base route
app.get("/", (req, res) => {
    res.send("Welcome to the Country Management API!");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

// Start the server
if (process.env.NODE_ENV !== "production") {
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
}

// Export the app (for Vercel)
module.exports = app;
