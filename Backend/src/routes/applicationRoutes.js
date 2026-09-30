const express = require("express");

const router = express.Router();

const {
    applyForJob,
    getMyApplications,
    getApplicationById,
    getJobApplicants,
    viewApplicantCV,
    updateApplicationStatus
} = require("../controllers/applicationController");

const authMiddleware =
    require("../middleware/authMiddleware");

const roleMiddleware =
    require("../middleware/roleMiddleware");

const {
    validateId,
    validateJobId,
    validateApplication
} = require("../middleware/validationMiddleware");


// =====================================================
// APPLY FOR JOB
// JOB SEEKER ONLY
// =====================================================

router.post(
    "/jobs/:jobId/apply",
    authMiddleware,
    roleMiddleware("JobSeeker"),
    validateJobId,
    validateApplication,
    applyForJob
);


// =====================================================
// GET MY APPLICATIONS
// JOB SEEKER ONLY
// =====================================================

router.get(
    "/me",
    authMiddleware,
    roleMiddleware("JobSeeker"),
    getMyApplications
);


// =====================================================
// GET JOB APPLICANTS
// EMPLOYER ONLY
// =====================================================

router.get(
    "/jobs/:jobId/applicants",
    authMiddleware,
    roleMiddleware("Employer"),
    validateJobId,
    getJobApplicants
);


// =====================================================
// VIEW APPLICANT CV
// EMPLOYER ONLY
// =====================================================

router.get(
    "/:id/cv",
    authMiddleware,
    roleMiddleware("Employer"),
    validateId,
    viewApplicantCV
);


// =====================================================
// UPDATE APPLICATION STATUS
// EMPLOYER ONLY
// =====================================================

router.patch(
    "/:id/status",
    authMiddleware,
    roleMiddleware("Employer"),
    validateId,
    updateApplicationStatus
);


// =====================================================
// GET APPLICATION BY ID
// JOB SEEKER ONLY
// =====================================================

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("JobSeeker"),
    validateId,
    getApplicationById
);


module.exports = router;