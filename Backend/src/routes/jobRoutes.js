const express = require("express");

const router = express.Router();

const {
    getAllJobs,
    getActiveJobs,
    filterJobs,
    searchJobs,
    sortJobs,
    paginateJobs,
    getJobById,
    createJob,
    updateJob,
    closeJob,
    getEmployerJobs
} = require("../controllers/jobController");

const { applyForJob } = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");

const allowRoles = require("../middleware/roleMiddleware");

// ================================
// GET ALL JOBS
// ================================

router.get(
    "/",
    getAllJobs
);

// ================================
// FILTER JOBS
// ================================

router.get(
    "/filter",
    filterJobs
);

// ================================
// SEARCH JOBS
// ================================

router.get(
    "/search",
    searchJobs
);

// ================================
// GET ACTIVE JOBS
// ================================

router.get(
    "/active",
    getActiveJobs
);

// ================================
// SORT JOBS
// ================================

router.get(
    "/sort",
    sortJobs
);

// ================================
// PAGINATE JOBS
// ================================

router.get(
    "/paginate",
    paginateJobs
);

// ================================
// GET EMPLOYER JOBS
// ================================

router.get(
    "/employer",
    authMiddleware,
    allowRoles("Employer"),
    getEmployerJobs
);

// ================================
// GET JOB BY ID
// ================================

router.get(
    "/:id",
    getJobById
);

// ================================
// APPLY FOR JOB
// ================================

router.post(
    "/:jobId/apply",
    authMiddleware,
    allowRoles("JobSeeker"),
    applyForJob
);

// ================================
// CREATE JOB - EMPLOYER ONLY
// ================================

router.post(
    "/",
    authMiddleware,
    allowRoles("Employer"),
    createJob
);

// ================================
// UPDATE JOB - EMPLOYER ONLY
// ================================

router.put(
    "/:id",
    authMiddleware,
    allowRoles("Employer"),
    updateJob
);

// ================================
// CLOSE JOB - EMPLOYER ONLY
// ================================

router.patch(
    "/:id/close",
    authMiddleware,
    allowRoles("Employer"),
    closeJob
);

module.exports = router;

