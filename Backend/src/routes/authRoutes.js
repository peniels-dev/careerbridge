const express = require("express");

const {
    register,
    login
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Registration
router.post("/register", register);

// Login
router.post("/login", login);

// Protected route - get current user
router.get("/me", authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            userId: req.user.userId,
            role: req.user.role
        }
    });
});

module.exports = router;