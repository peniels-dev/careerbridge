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

const {
    applyForJob
} = require("../controllers/applicationController");

const authMiddleware =
    require("../middleware/authMiddleware");

const allowRoles =
    require("../middleware/roleMiddleware");

const {
    validateId,
    validateJobId,
    validateJob,
    validateApplication
} = require("../middleware/validationMiddleware");


// =====================================================
// GET ALL JOBS
// PUBLIC
// =====================================================

router.get(
    "/",
    getAllJobs
);


// =====================================================
// FILTER JOBS
// PUBLIC
// =====================================================

router.get(
    "/filter",
    filterJobs
);


// =====================================================
// SEARCH JOBS
// PUBLIC
// =====================================================

router.get(
    "/search",
    searchJobs
);


// =====================================================
// GET ACTIVE JOBS
// PUBLIC
// =====================================================

router.get(
    "/active",
    getActiveJobs
);


// =====================================================
// SORT JOBS
// PUBLIC
// =====================================================

router.get(
    "/sort",
    sortJobs
);


// =====================================================
// PAGINATE JOBS
// PUBLIC
// =====================================================

router.get(
    "/paginate",
    paginateJobs
);


// =====================================================
// GET EMPLOYER JOBS
// EMPLOYER ONLY
// =====================================================

router.get(
    "/employer",
    authMiddleware,
    allowRoles("Employer"),
    getEmployerJobs
);


// =====================================================
// GET JOB BY ID
// PUBLIC
// =====================================================

router.get(
    "/:id",
    validateId,
    getJobById
);


// =====================================================
// APPLY FOR JOB
// JOB SEEKER ONLY
// =====================================================

router.post(
    "/:jobId/apply",
    authMiddleware,
    allowRoles("JobSeeker"),
    validateJobId,
    validateApplication,
    applyForJob
);


// =====================================================
// CREATE JOB
// EMPLOYER ONLY
// =====================================================

router.post(
    "/",
    authMiddleware,
    allowRoles("Employer"),
    validateJob,
    createJob
);


// =====================================================
// UPDATE JOB
// EMPLOYER ONLY
// =====================================================

router.put(
    "/:id",
    authMiddleware,
    allowRoles("Employer"),
    validateId,
    validateJob,
    updateJob
);


// =====================================================
// CLOSE JOB
// EMPLOYER ONLY
// =====================================================

router.patch(
    "/:id/close",
    authMiddleware,
    allowRoles("Employer"),
    validateId,
    closeJob
);


module.exports = router;