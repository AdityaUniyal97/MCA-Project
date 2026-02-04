const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ FRONTEND FOLDER (backend ke bahar hai)
app.use(express.static(path.join(__dirname, "..", "frontend")));

// ✅ API ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/driver", require("./routes/driverRoutes"));

// ✅ DEFAULT ROUTE
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

app.listen(5000, () => {
    console.log("Backend running on http://localhost:5000");
});
