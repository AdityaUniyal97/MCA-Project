const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Connect route files ONLY
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/driver", require("./routes/driverRoutes"));

app.listen(5000, () => {
    console.log("Backend running on port 5000");
});
