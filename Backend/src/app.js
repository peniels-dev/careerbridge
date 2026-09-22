const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/database");

const app = express();


const PORT = process.env.PORT || 5138;

const authRoutes = require("./routes/authRoutes");

const jobRoutes = require("./routes/jobRoutes");

const applicationRoutes = require("./routes/applicationRoutes");

app.use(cors());
app.use(express.json());


app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "CareerBridge API is healthy"
    });
});

app.use("/api/auth",authRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api", applicationRoutes);

app.use("/api/applications", applicationRoutes);






// Home route
app.get("/", (req, res) => {
    res.json({
        message: "CareerBridge API is running"
    });
});

// Health check





// Get companies
app.get("/api/companies", async (req, res) => {
    try {
        const pool = await connectDB();

        const result = await pool
            .request()
            .query("SELECT * FROM Company");

        res.json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });

    } catch (error) {
        console.error("Companies error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve companies"
        });
    }
});

// Get job categories
app.get("/api/categories", async (req, res) => {
    try {
        const pool = await connectDB();

        const result = await pool
            .request()
            .query("SELECT * FROM Category");

        res.json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });

    } catch (error) {
        console.error("Categories error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve categories"
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`CareerBridge API running on port ${PORT}`);
});