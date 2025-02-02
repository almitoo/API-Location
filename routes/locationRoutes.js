const express = require("express");
const router = express.Router();
const Country = require("../models/Country");
const ApiRequestLog = require("../models/ApiRequestLog"); 


// Ray Casting Algorithm
function booleanPointInPolygon(point, polygon) {
    const [px, py] = point; // Point coordinates
    const vertices = polygon; // List of polygon vertices

    let intersects = 0;

    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        const [xi, yi] = vertices[i];
        const [xj, yj] = vertices[j];

        // Check if the ray intersects with the edge
        const intersect =
            yi > py !== yj > py &&
            px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;

        if (intersect) {
            intersects++;
        }
    }

    // Odd number of intersections means the point is inside the polygon
    return intersects % 2 !== 0;
}

// POST endpoint to handle coordinates and country code
router.post('/', async (req, res) => {
    const { lon, lat, countryCode } = req.body;

    // Basic validation
    if (
        typeof lon !== 'number' ||
        typeof lat !== 'number' ||
        typeof countryCode !== 'string' ||
        countryCode.length !== 2
    ) {
        return res.status(400).json({ success: false, message: 'Invalid input' });
    }

    let country;
    try {
        country = await Country.findOne({ code: countryCode });
    } catch (error) {
        return res.status(404).json({ success: false, message: 'Country not found' });
    }

    if (!country) {
        return res.status(404).json({ success: false, message: 'Country not found' });
    }

    


    const countryPolygons = country.polygons;
    const point = [lon, lat];
    let isInside = false;
    for (const polygon of countryPolygons) {
        if (booleanPointInPolygon(point, polygon)) {
            isInside = true; // Point is inside one of the polygons
        }
    }

    try {
        await ApiRequestLog.create({
            countryCode,
            lon,
            lat,
            result: isInside
        });
    } catch (error) {
        console.error("Failed to save API request log:", error);
    }

    if (isInside) {

    
        res.json({ success: true, message: 'Coordinates belong to the country' });
    } else {

       
        res.json({ success: false, message: 'Coordinates do not belong to the country' });
    }


    

});

module.exports = router;

