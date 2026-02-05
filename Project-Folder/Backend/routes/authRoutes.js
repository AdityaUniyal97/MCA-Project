const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { loginUser, signupUser, googleSignIn, getProfile } = require("../controllers/authController");

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.post("/google", googleSignIn);
router.get("/me", authMiddleware, getProfile);

module.exports = router;
