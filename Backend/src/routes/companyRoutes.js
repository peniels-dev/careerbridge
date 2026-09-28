const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const {
    getMyCompany,
    getCompanyById,
    updateMyCompany,
    uploadCompanyLogo
} = require("../controllers/companyController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// =====================================================
// COMPANY LOGO UPLOAD CONFIGURATION
// =====================================================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/company-logos");
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }
});

// =====================================================
// ALLOWED COMPANY LOGO FILE TYPES
// =====================================================

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only PNG, JPG, JPEG, and WEBP image files are allowed."
            )
        );
    }
};

// =====================================================
// MULTER UPLOAD SETTINGS
// Maximum logo size: 2 MB
// =====================================================

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024
    }
});

// =====================================================
// EMPLOYER'S OWN COMPANY
// =====================================================

router.get(
    "/me",
    authMiddleware,
    roleMiddleware("Employer"),
    getMyCompany
);

// =====================================================
// UPDATE EMPLOYER'S COMPANY
// =====================================================

router.put(
    "/me",
    authMiddleware,
    roleMiddleware("Employer"),
    updateMyCompany
);

// =====================================================
// UPLOAD / CHANGE COMPANY LOGO
// =====================================================

router.post(
    "/me/logo",
    authMiddleware,
    roleMiddleware("Employer"),
    upload.single("logo"),
    uploadCompanyLogo
);

// =====================================================
// VIEW COMPANY
// JobSeekers and Employers can view a company
// =====================================================

router.get(
    "/:id",
    authMiddleware,
    getCompanyById
);

module.exports = router;