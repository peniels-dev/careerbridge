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
// ERROR MIDDLEWARE
// =====================================================

const {
    errorHandler,
    notFoundHandler
} = require("./middleware/errorMiddleware");


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

app.get("/api/companies", async (req, res, next) => {
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
        next(error);
    }
});


// =====================================================
// COMPANY ROUTES
// =====================================================

app.use("/api/companies", companyRoutes);


// =====================================================
// GET JOB CATEGORIES
// IMPORTANT: MUST COME BEFORE /api APPLICATION ROUTES
// =====================================================

app.get("/api/categories", async (req, res, next) => {
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
        next(error);
    }
});


// =====================================================
// CV ROUTES
// =====================================================

app.use("/api/cvs", cvRoutes);


// =====================================================
// APPLICATION ROUTES
// =====================================================

app.use("/api/applications", applicationRoutes);

app.use("/api", applicationRoutes);


// =====================================================
// ADMIN ROUTES
// =====================================================

app.use("/api/admin", adminRoutes);


// =====================================================
// HOME ROUTE
// =====================================================

app.get("/", (req, res) => {
    res.json({
        message: "CareerBridge API is running"
    });
});


// =====================================================
// CONTROLLED 404 HANDLER
// MUST COME AFTER ALL ROUTES
// =====================================================

app.use(notFoundHandler);


// =====================================================
// CENTRALIZED ERROR HANDLER
// MUST ALWAYS BE THE LAST MIDDLEWARE
// =====================================================

app.use(errorHandler);


// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
    console.log(
        `CareerBridge API running on port ${PORT}`
    );
});