const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name of the country (e.g., United States)
    code: { type: String, required: true, unique: true }, // 2-letter country code (e.g., US, IL)
    polygons: { 
        type: [[[Number]]], // Array of polygons, each polygon is an array of [lon, lat] coordinates
        required: true,
    },
  
});

module.exports = mongoose.model("Country", countrySchema);
