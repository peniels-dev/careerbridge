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

const {
    validateId
} = require("../middleware/validationMiddleware");


// Upload a CV
router.post(
    "/",
    authMiddleware,
    roleMiddleware("JobSeeker"),

    (req, res, next) => {
        upload.single("cv")(req, res, (err) => {

            if (err) {

                // File is larger than 5 MB
                if (err.code === "LIMIT_FILE_SIZE") {
                    return res.status(400).json({
                        success: false,
                        message: "CV file is too large. Maximum file size is 5 MB."
                    });
                }

                // Unsupported file type
                return res.status(400).json({
                    success: false,
                    message: err.message || "Unable to upload CV."
                });
            }

            next();
        });
    },

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
    validateId,
    getCV
);


// Delete a CV
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("JobSeeker"),
    validateId,
    deleteCV
);


module.exports = router;