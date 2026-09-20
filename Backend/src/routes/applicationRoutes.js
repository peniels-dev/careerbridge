const express = require("express");

const router = express.Router();

const {
    applyForJob,
    getMyApplications,
    getApplicationById,
    getJobApplicants,
    updateApplicationStatus
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
    "/jobs/:jobId/apply",
    authMiddleware,
    applyForJob
);

router.get(
    "/me",
    authMiddleware,
    roleMiddleware("JobSeeker"),
    getMyApplications
);

router.get(
    "/jobs/:jobId/applicants",
    authMiddleware,
    roleMiddleware("Employer"),
    getJobApplicants
);

router.patch(
    "/:id/status",
    authMiddleware,
    roleMiddleware("Employer"),
    updateApplicationStatus
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("JobSeeker"),
    getApplicationById
);



module.exports = router;