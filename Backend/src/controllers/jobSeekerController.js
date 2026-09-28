const { sql, connectDB } = require("../config/database");

// Get logged-in Job Seeker profile
const getMyProfile = async (req, res) => {
    try {
        const pool = await connectDB();

        const result = await pool
            .request()
            .input("UserID", sql.Int, req.user.userId)
            .query(`
                SELECT
                    u.UserID,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    js.JobSeekerID,
                    js.Phone,
                    js.Location,
                    js.Skills,
                    js.Education
                FROM [User] u
                INNER JOIN JobSeeker js
                    ON u.UserID = js.UserID
                WHERE u.UserID = @UserID
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Job Seeker profile not found"
            });
        }

        res.status(200).json({
            success: true,
            data: result.recordset[0]
        });

    } catch (error) {
        console.error("Get Job Seeker profile error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get Job Seeker profile"
        });
    }
};


// Update logged-in Job Seeker profile
const updateMyProfile = async (req, res) => {
    try {
        const {
            phone,
            location,
            skills,
            education
        } = req.body;

        const pool = await connectDB();

        const result = await pool
            .request()
            .input("UserID", sql.Int, req.user.userId)
            .input("Phone", sql.VarChar, phone || null)
            .input("Location", sql.VarChar, location || null)
            .input("Skills", sql.VarChar, skills || null)
            .input("Education", sql.VarChar, education || null)
            .query(`
                UPDATE JobSeeker
                SET
                    Phone = @Phone,
                    Location = @Location,
                    Skills = @Skills,
                    Education = @Education
                WHERE UserID = @UserID;

                SELECT
                    js.JobSeekerID,
                    u.UserID,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    js.Phone,
                    js.Location,
                    js.Skills,
                    js.Education
                FROM [User] u
                INNER JOIN JobSeeker js
                    ON u.UserID = js.UserID
                WHERE u.UserID = @UserID;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Job Seeker profile not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: result.recordset[0]
        });

    } catch (error) {
        console.error("Update Job Seeker profile error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update Job Seeker profile"
        });
    }
};


module.exports = {
    getMyProfile,
    updateMyProfile
};