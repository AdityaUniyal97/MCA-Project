const express = require("express");
const router = express.Router();

// GET request
router.get("/info", (req, res) => {
    res.json({
        driverName: "ABS",
        busNumber: "UK07-1234",
        status: "Online"
    });
});

module.exports = router;
