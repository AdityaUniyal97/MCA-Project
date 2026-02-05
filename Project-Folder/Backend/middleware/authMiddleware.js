const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET || "change-this-secret";

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Missing authentication token." });
    }

    try {
        const payload = jwt.verify(token, jwtSecret);
        req.user = payload;
        next();
    } catch (error) {
        console.error("Token verification failed", error);
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};
