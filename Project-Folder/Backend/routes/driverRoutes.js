const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/info", authMiddleware, (req, res) => {
    res.json({
        driverName: "ABS Kuldeep",
        busNumber: "UK07-1234",
        status: "Online",
        user: req.user
    });
});

module.exports = router;
