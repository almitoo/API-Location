
const express = require("express");
const router = express.Router();
const ApiRequestLog = require("../models/ApiRequestLog"); 

const {authenticateToken} = require("../auth/authenticateToken");

router.get('/',authenticateToken, async (req, res) => {
    try {
        const stats = await ApiRequestLog.aggregate([
            {
                $group: {
                    _id: "$countryCode",
                    totalRequests: { $sum: 1 },
                    trueResponses: { $sum: { $cond: ["$result", 1, 0] } },
                    falseResponses: { $sum: { $cond: ["$result", 0, 1] } }
                }
            }
        ]);

        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
    }
});


module.exports = router;