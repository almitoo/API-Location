const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Stored as plain text 
});

module.exports = mongoose.model("User", userSchema);