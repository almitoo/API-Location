const express = require("express");
const router = express.Router();
const Country = require("../models/Country");

const {authenticateToken} = require("../auth/authenticateToken");

// Add a new country
router.post("/", authenticateToken, async (req, res) => {
    const { name, code, polygons } = req.body;

    try {
        const newCountry = new Country({ name, code, polygons });
        console.log("newCountry", newCountry);

        await newCountry.save();
        res.status(201).json({ message: "Country added successfully", country: newCountry });
    } catch (error) {
        res.status(400).json({ message: "Error adding country", error: error.message });
    }
});

// Update a country
router.put("/:code", authenticateToken, async (req, res) => {
    const { code } = req.params;
    const { polygons } = req.body;

    try {
        const updatedCountry = await Country.findOneAndUpdate(
            { code },
            { polygons },
            { new: true }
        );

        if (!updatedCountry) {
            return res.status(404).json({ message: "Country not found" });
        }

        res.json({ message: "Country updated successfully", country: updatedCountry });
    } catch (error) {
        res.status(400).json({ message: "Error updating country", error: error.message });
    }
});

// Delete a country
router.delete("/:code", authenticateToken, async (req, res) => {
    const { code } = req.params;

    try {
        const deletedCountry = await Country.findOneAndDelete({ code });

        if (!deletedCountry) {
            return res.status(404).json({ message: "Country not found" });
        }

        res.json({ message: "Country deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error deleting country", error: error.message });
    }
});

// Get all countries
router.get("/", authenticateToken, async (req, res) => {
    try {
        const countries = await Country.find();
        res.json(countries);
    } catch (error) {
        res.status(500).json({ message: "Error fetching countries", error: error.message });
    }
});

module.exports = router;

