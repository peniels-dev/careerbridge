const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/database");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 5138;

// =====================================================
// ROUTES
// =====================================================

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const cvRoutes = require("./routes/cvRoutes");
const companyRoutes = require("./routes/companyRoutes");
const jobSeekerRoutes = require("./routes/jobSeekerRoutes");
const adminRoutes = require("./routes/adminRoutes");

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(express.json());

// =====================================================
// UPLOADED FILES
// =====================================================

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "CareerBridge API is healthy"
    });
});

// =====================================================
// AUTH ROUTES
// =====================================================

app.use("/api/auth", authRoutes);

// =====================================================
// JOB ROUTES
// =====================================================

app.use("/api/jobs", jobRoutes);

app.use("/api/jobseeker", jobSeekerRoutes);



// =====================================================
// GET COMPANIES
// =====================================================

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

// =====================================================
// COMPANY ROUTES
// =====================================================

app.use("/api/companies", companyRoutes);

// =====================================================
// GET JOB CATEGORIES
// IMPORTANT: THIS MUST COME BEFORE /api APPLICATION ROUTES
// =====================================================

app.get("/api/categories", async (req, res) => {
    try {
        const pool = await connectDB();

        const result = await pool
            .request()
            .query(`
                SELECT
                    CategoryID,
                    CategoryName,
                    Description,
                    CreatedDate,
                    Status
                FROM Category
                WHERE Status = 1
                ORDER BY CategoryName ASC
            `);

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

// =====================================================
// APPLICATION ROUTES
// =====================================================

app.use("/api/cvs", cvRoutes);

app.use("/api/applications", applicationRoutes);

app.use("/api", applicationRoutes);

// =====================================================
// HOME ROUTE
// =====================================================

app.get("/", (req, res) => {
    res.json({
        message: "CareerBridge API is running"
    });
});

// =====================================================
// ERROR HANDLING
// =====================================================

app.use((err, req, res, next) => {
    console.error("Server error:", err);

    // CV is larger than 5 MB
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            success: false,
            message: "CV file must not exceed 5 MB."
        });
    }

    // Invalid CV file type
    if (
        err.message ===
        "Only PDF, DOC, and DOCX files are allowed."
    ) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    // Other server errors
    return res.status(500).json({
        success: false,
        message: "Something went wrong on the server."
    });
});

app.use("/api/admin", adminRoutes);

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
    console.log(
        `CareerBridge API running on port ${PORT}`
    );
});

