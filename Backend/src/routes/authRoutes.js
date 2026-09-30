const express = require("express");

const {
    register,
    login,
    verifyPasswordReset,
    resetPassword
} = require("../controllers/authController");

const {
    validateRegistration
} = require("../middleware/validationMiddleware");

const authMiddleware = require("../middleware/authMiddleware");

const {
    sql,
    connectDB
} = require("../config/database");

const router = express.Router();

// =========================
// REGISTER
// =========================

router.post(
    "/register",
    validateRegistration,
    register
);

// =========================
// LOGIN
// =========================

router.post(
    "/login",
    login
);

// =========================
// PASSWORD RESET
// =========================

router.post(
    "/verify-reset",
    verifyPasswordReset
);

router.post(
    "/reset-password",
    resetPassword
);

// =========================
// GET CURRENT USER
// =========================

router.get(
    "/me",
    authMiddleware,
    async (req, res) => {
        try {
            console.log(
                "========== /AUTH/ME =========="
            );

            console.log(
                "Authenticated user:",
                req.user
            );

            const pool = await connectDB();

            const result = await pool
                .request()
                .input(
                    "UserID",
                    sql.Int,
                    req.user.userId
                )
                .query(`
                    SELECT
                        UserID,
                        FirstName,
                        LastName,
                        Email,
                        Role,
                        IsActive
                    FROM [User]
                    WHERE UserID = @UserID
                `);

            // User does not exist
            if (
                result.recordset.length === 0
            ) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            const user =
                result.recordset[0];

            return res.status(200).json({
                success: true,

                data: {
                    userId: user.UserID,
                    firstName: user.FirstName,
                    lastName: user.LastName,
                    email: user.Email,
                    role: user.Role,
                    isActive: user.IsActive
                }
            });

        } catch (error) {
            console.error(
                "Get current user error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Unable to retrieve user information"
            });
        }
    }
);

module.exports = router;

