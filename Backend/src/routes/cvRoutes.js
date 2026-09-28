const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    uploadCV,
    getMyCVs,
    getCV,
    deleteCV
} = require("../controllers/cvController");


// Upload a CV
router.post(
    "/",
    authMiddleware,
    roleMiddleware("JobSeeker"),
    upload.single("cv"),
    uploadCV
);


// Get logged-in JobSeeker's CVs
router.get(
    "/",
    authMiddleware,
    roleMiddleware("JobSeeker"),
    getMyCVs
);


// View a CV
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("JobSeeker"),
    getCV
);


// Delete a CV
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("JobSeeker"),
    deleteCV
);


module.exports = router;

