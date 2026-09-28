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

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// =====================================================
// APPLY FOR JOB
// =====================================================

router.post(
    "/jobs/:jobId/apply",
    authMiddleware,
    roleMiddleware("JobSeeker"),
    applyForJob
);

// =====================================================
// GET MY APPLICATIONS
// =====================================================

router.get(
    "/me",
    authMiddleware,
    roleMiddleware("JobSeeker"),
    getMyApplications
);

// =====================================================
// GET JOB APPLICANTS
// =====================================================

router.get(
    "/jobs/:jobId/applicants",
    authMiddleware,
    roleMiddleware("Employer"),
    getJobApplicants
);

// =====================================================
// VIEW APPLICANT CV
// =====================================================

router.get(
    "/:id/cv",
    authMiddleware,
    roleMiddleware("Employer"),
    viewApplicantCV
);

// =====================================================
// UPDATE APPLICATION STATUS
// =====================================================

router.patch(
    "/:id/status",
    authMiddleware,
    roleMiddleware("Employer"),
    updateApplicationStatus
);

// =====================================================
// GET APPLICATION BY ID
// =====================================================

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("JobSeeker"),
    getApplicationById
);

module.exports = router;