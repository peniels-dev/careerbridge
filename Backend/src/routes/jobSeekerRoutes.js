const express = require("express");

const router = express.Router();

const {
    getMyProfile,
    updateMyProfile
} = require("../controllers/jobSeekerController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Get logged-in job seeker's profile
router.get(
    "/profile",
    authMiddleware,
    roleMiddleware("JobSeeker"),
    getMyProfile
);

// Update logged-in job seeker's profile
router.put(
    "/profile",
    authMiddleware,
    roleMiddleware("JobSeeker"),
    updateMyProfile
);

module.exports = router;