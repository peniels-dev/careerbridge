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
                    u.MiddleName,
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
            firstName,
            middleName,
            lastName,
            phone,
            location,
            skills,
            education
        } = req.body;

        // Basic validation
        if (!firstName || !firstName.trim()) {
            return res.status(400).json({
                success: false,
                message: "First name is required."
            });
        }

        if (!lastName || !lastName.trim()) {
            return res.status(400).json({
                success: false,
                message: "Last name is required."
            });
        }

        const pool = await connectDB();

        const userID = req.user.userId;

        // Update the User table
        // Email is intentionally NOT included.
        await pool
            .request()
            .input("UserID", sql.Int, userID)
            .input(
                "FirstName",
                sql.VarChar,
                firstName.trim()
            )
            .input(
                "MiddleName",
                sql.VarChar,
                middleName && middleName.trim()
                    ? middleName.trim()
                    : null
            )
            .input(
                "LastName",
                sql.VarChar,
                lastName.trim()
            )
            .query(`
                UPDATE [User]
                SET
                    FirstName = @FirstName,
                    MiddleName = @MiddleName,
                    LastName = @LastName
                WHERE UserID = @UserID
            `);


        // Update the JobSeeker table
        await pool
            .request()
            .input("UserID", sql.Int, userID)
            .input(
                "Phone",
                sql.VarChar,
                phone && phone.trim()
                    ? phone.trim()
                    : null
            )
            .input(
                "Location",
                sql.VarChar,
                location && location.trim()
                    ? location.trim()
                    : null
            )
            .input(
                "Skills",
                sql.VarChar,
                skills && skills.trim()
                    ? skills.trim()
                    : null
            )
            .input(
                "Education",
                sql.VarChar,
                education && education.trim()
                    ? education.trim()
                    : null
            )
            .query(`
                UPDATE JobSeeker
                SET
                    Phone = @Phone,
                    Location = @Location,
                    Skills = @Skills,
                    Education = @Education
                WHERE UserID = @UserID
            `);


        // Get the updated profile
        const result = await pool
            .request()
            .input("UserID", sql.Int, userID)
            .query(`
                SELECT
                    u.UserID,
                    u.FirstName,
                    u.MiddleName,
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