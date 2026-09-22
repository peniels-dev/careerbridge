const express = require("express");

const {
    register,
    login
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const { sql, connectDB } = require("../config/database");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const pool = await connectDB();

        const result = await pool
            .request()
            .input("UserID", sql.Int, req.user.userId)
            .query(`
                SELECT
                    UserID,
                    FirstName,
                    LastName,
                    Email,
                    Role
                FROM [User]
                WHERE UserID = @UserID
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const user = result.recordset[0];

        res.status(200).json({
            success: true,
            data: {
                userId: user.UserID,
                firstName: user.FirstName,
                lastName: user.LastName,
                email: user.Email,
                role: user.Role
            }
        });

    } catch (error) {
        console.error("Get current user error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve user information"
        });
    }
});

module.exports = router;