const mongoose = require("mongoose");

const apiRequestLogSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    countryCode: { type: String, required: true },
    lon: { type: Number, required: true },
    lat: { type: Number, required: true },
    result: { type: Boolean, required: true }
});

module.exports = mongoose.model("ApiRequestLog", apiRequestLogSchema);
