require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/driver", require("./routes/driverRoutes"));

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use((err, req, res, next) => {
    console.error("Unhandled error", err);
    res.status(500).json({ message: "Something went wrong." });
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
