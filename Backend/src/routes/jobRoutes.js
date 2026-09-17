const express = require("express");

const router = express.Router();

const {
    getAllJobs,
    getActiveJobs,
    filterJobsByLocation,
    filterJobsByJobType,
    filterJobsByCategory,
    filterJobs,
    searchJobs,
    sortJobs,
    paginateJobs,
    getJobById,
    createJob,
    updateJob,
    closeJob
} = require("../controllers/jobController");

const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// GET ALL JOBS
router.get("/", getAllJobs);

// FILTER JOBS BY LOCATION
router.get("/filter/location", filterJobsByLocation);

// FILTER JOBS BY JOB TYPE
router.get("/filter/job-type", filterJobsByJobType);

// FILTER JOBS BY CATEGORY
router.get("/filter/category", filterJobsByCategory);

// FILTER JOBS BY MULTIPLE CRITERIA
router.get("/filter", filterJobs);

// SEARCH JOBS
router.get("/search", searchJobs);

// GET ACTIVE JOBS
router.get("/active", getActiveJobs);

// SORT JOBS
router.get("/sort", sortJobs);

// PAGINATE JOBS
router.get("/paginate", paginateJobs);

// GET JOB BY ID
router.get("/:id", getJobById);

// CREATE JOB - EMPLOYER ONLY
router.post(
    "/",
    authMiddleware,
    allowRoles("Employer"),
    createJob
);

// UPDATE JOB - EMPLOYER ONLY
router.put(
    "/:id",
    authMiddleware,
    allowRoles("Employer"),
    updateJob
);

// CLOSE JOB - EMPLOYER ONLY
router.patch(
    "/:id/close",
    authMiddleware,
    allowRoles("Employer"),
    closeJob
);

// GET EMPLOYER JOBS WITH APPLICATION COUNT
const getEmployerJobs = async (req, res) => {
    try {
        const userId = req.user.userId;

        const pool = await connectDB();

        const result = await pool
            .request()
            .input("UserID", sql.Int, userId)
            .query(`
                SELECT
                    j.JobID,
                    j.JobTitle,
                    COUNT(a.ApplicationID) AS applicationCount
                FROM Job j
                INNER JOIN Company c
                    ON j.CompanyID = c.CompanyID
                LEFT JOIN Application a
                    ON j.JobID = a.JobID
                WHERE c.UserID = @UserID
                GROUP BY
                    j.JobID,
                    j.JobTitle
                ORDER BY j.PostedDate DESC
            `);

        res.status(200).json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error("Get employer jobs error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve employer jobs"
        });
    }
};

module.exports = router;