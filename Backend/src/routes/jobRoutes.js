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

const { applyForJob } = require("../controllers/applicationController");
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

router.post("/:jobId/apply", applyForJob);

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



module.exports = router;