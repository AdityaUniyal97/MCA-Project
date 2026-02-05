const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const jwtSecret = process.env.JWT_SECRET || "change-this-secret";
const jwtExpiry = "2h";
const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
const googleClient = googleClientId ? new OAuth2Client(googleClientId) : null;

const createToken = user =>
    jwt.sign(
        {
            sub: user._id.toString(),
            role: user.role,
            email: user.email,
            displayName: user.displayName || user.email
        },
        jwtSecret,
        {
            expiresIn: jwtExpiry
        }
    );

const respondWithToken = user => {
    const token = createToken(user);
    return {
        token,
        role: user.role,
        displayName: user.displayName || user.email,
        email: user.email
    };
};

const normalizeRole = role => (role === "Driver" ? "Driver" : "Student");

exports.signupUser = async (req, res) => {
    try {
        const { email, password, role, displayName } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const lowerEmail = email.toLowerCase();
        const existingUser = await User.findOne({ email: lowerEmail });

        if (existingUser) {
            return res.status(409).json({ message: "Email already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            email: lowerEmail,
            password: hashedPassword,
            role: normalizeRole(role),
            displayName: displayName || email
        });

        return res.json({
            message: "Signup successful",
            ...respondWithToken(user)
        });
    } catch (error) {
        console.error("Signup error", error);
        return res.status(500).json({ message: "Unable to sign up. Try again later." });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user || !user.password) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        return res.json({
            message: "Login successful",
            ...respondWithToken(user)
        });
    } catch (error) {
        console.error("Login error", error);
        return res.status(500).json({ message: "Unable to log in. Try again later." });
    }
};

exports.googleSignIn = async (req, res) => {
    try {
        const { credential, role } = req.body;

        if (!credential) {
            return res.status(400).json({ message: "Google credential missing." });
        }

        if (!googleClient) {
            return res.status(500).json({ message: "Google client is not configured." });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: googleClientId
        });

        const payload = ticket.getPayload();
        if (!payload?.email) {
            return res.status(400).json({ message: "Google payload missing email." });
        }

        const normalizedEmail = payload.email.toLowerCase();
        const expectedRole = normalizeRole(role);

        let user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            user = await User.create({
                email: normalizedEmail,
                displayName: payload.name || payload.email,
                googleId: payload.sub,
                role: expectedRole
            });
        } else {
            let modified = false;
            if (!user.googleId && payload.sub) {
                user.googleId = payload.sub;
                modified = true;
            }
            if (payload.name && payload.name !== user.displayName) {
                user.displayName = payload.name;
                modified = true;
            }
            if (modified) {
                await user.save();
            }
        }

        return res.json({
            message: "Google login successful",
            ...respondWithToken(user)
        });
    } catch (error) {
        console.error("Google sign-in error", error);
        return res.status(400).json({ message: "Unable to verify Google token." });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user?.sub).select("email role displayName");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.json({
            user: {
                email: user.email,
                role: user.role,
                displayName: user.displayName || user.email
            }
        });
    } catch (error) {
        console.error("Profile fetch error", error);
        return res.status(500).json({ message: "Unable to read profile." });
    }
};
