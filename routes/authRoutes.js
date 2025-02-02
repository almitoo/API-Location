const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const {getJwtSecret} = require("../auth/authenticateToken");


router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Ensure email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Save user
        const user = await User.create({ email, password });
        const token = jwt.sign({ email: user.email }, getJwtSecret(), { expiresIn: "7d" });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: "Error registering user" });
    }
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate token
        const token = jwt.sign({ email: user.email }, getJwtSecret(), { expiresIn: "7d" });
        res.json({ token });
    } catch (err) {
        console.log("error", err);
        res.status(500).json({ message: "Error logging in" });
    }
});

module.exports = router;
