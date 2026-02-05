const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String
    },
    displayName: {
        type: String
    },
    role: {
        type: String,
        enum: ["Student", "Driver"],
        default: "Student"
    },
    googleId: {
        type: String
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    }
});

module.exports = mongoose.model("User", userSchema);
