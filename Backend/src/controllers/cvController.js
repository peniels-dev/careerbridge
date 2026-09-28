const fs = require("fs");
const path = require("path");
const { sql, connectDB } = require("../config/database");


// =====================================================
// UPLOAD CV
// =====================================================
const uploadCV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select a CV file."
            });
        }

        const pool = await connectDB();

        const userId = req.user.userId;

        // Find JobSeekerID from logged-in UserID
        const jobSeekerResult = await pool.request()
            .input("UserID", sql.Int, userId)
            .query(`
                SELECT JobSeekerID
                FROM JobSeeker
                WHERE UserID = @UserID
            `);

        if (jobSeekerResult.recordset.length === 0) {

            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            return res.status(404).json({
                success: false,
                message: "JobSeeker profile not found for this user."
            });
        }

        const jobSeekerId =
            jobSeekerResult.recordset[0].JobSeekerID;

        const cvTitle =
            req.body.cvTitle || req.file.originalname;

        const filePath = req.file.path;

        const result = await pool.request()
            .input("JobSeekerID", sql.Int, jobSeekerId)
            .input("CVTitle", sql.NVarChar, cvTitle)
            .input("FilePath", sql.NVarChar, filePath)
            .query(`
                INSERT INTO CV
                (
                    JobSeekerID,
                    CVTitle,
                    FilePath
                )
                OUTPUT INSERTED.*
                VALUES
                (
                    @JobSeekerID,
                    @CVTitle,
                    @FilePath
                )
            `);

        return res.status(201).json({
            success: true,
            message: "CV uploaded successfully.",
            data: result.recordset[0]
        });

    } catch (error) {

        console.error("Upload CV error:", error);

        if (req.file) {
            try {
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
            } catch (deleteError) {
                console.error(
                    "Could not delete uploaded file:",
                    deleteError
                );
            }
        }

        return res.status(500).json({
            success: false,
            message: "Failed to upload CV.",
            error: error.message
        });
    }
};


// =====================================================
// GET MY CVS
// =====================================================
const getMyCVs = async (req, res) => {
    try {
        const userId = req.user.userId;

        const pool = await connectDB();

        const jobSeekerResult = await pool.request()
            .input("UserID", sql.Int, userId)
            .query(`
                SELECT JobSeekerID
                FROM JobSeeker
                WHERE UserID = @UserID
            `);

        if (jobSeekerResult.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "JobSeeker profile not found."
            });
        }

        const jobSeekerId =
            jobSeekerResult.recordset[0].JobSeekerID;

        const result = await pool.request()
            .input("JobSeekerID", sql.Int, jobSeekerId)
            .query(`
                SELECT
                    CVID,
                    CVTitle,
                    FilePath,
                    UploadDate,
                    LastUpdated
                FROM CV
                WHERE JobSeekerID = @JobSeekerID
                ORDER BY UploadDate DESC
            `);

        return res.status(200).json({
            success: true,
            data: result.recordset
        });

    } catch (error) {

        console.error("Get CVs error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve CVs."
        });
    }
};


// =====================================================
// VIEW CV
// =====================================================
const getCV = async (req, res) => {
    try {
        const pool = await connectDB();

        const userId = req.user.userId;

        const cvId = parseInt(req.params.id);

        if (isNaN(cvId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid CV ID."
            });
        }

        // Find JobSeekerID
        const jobSeekerResult = await pool.request()
            .input("UserID", sql.Int, userId)
            .query(`
                SELECT JobSeekerID
                FROM JobSeeker
                WHERE UserID = @UserID
            `);

        if (jobSeekerResult.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "JobSeeker profile not found."
            });
        }

        const jobSeekerId =
            jobSeekerResult.recordset[0].JobSeekerID;

        // Find CV belonging to this user
        const result = await pool.request()
            .input("CVID", sql.Int, cvId)
            .input("JobSeekerID", sql.Int, jobSeekerId)
            .query(`
                SELECT FilePath
                FROM CV
                WHERE CVID = @CVID
                AND JobSeekerID = @JobSeekerID
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "CV not found."
            });
        }

        const filePath = result.recordset[0].FilePath;

        if (!filePath || !fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: "CV file could not be found on the server."
            });
        }

        return res.sendFile(path.resolve(filePath));

    } catch (error) {

        console.error("Get CV error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve CV.",
            error: error.message
        });
    }
};


// =====================================================
// DELETE CV
// =====================================================
const deleteCV = async (req, res) => {
    try {
        const pool = await connectDB();

        const userId = req.user.userId;

        const cvId = parseInt(req.params.id);

        if (isNaN(cvId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid CV ID."
            });
        }

        // Find JobSeekerID
        const jobSeekerResult = await pool.request()
            .input("UserID", sql.Int, userId)
            .query(`
                SELECT JobSeekerID
                FROM JobSeeker
                WHERE UserID = @UserID
            `);

        if (jobSeekerResult.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "JobSeeker profile not found."
            });
        }

        const jobSeekerId =
            jobSeekerResult.recordset[0].JobSeekerID;

        // Find CV
        const cvResult = await pool.request()
            .input("CVID", sql.Int, cvId)
            .input("JobSeekerID", sql.Int, jobSeekerId)
            .query(`
                SELECT
                    CVID,
                    FilePath,
                    CVTitle
                FROM CV
                WHERE CVID = @CVID
                AND JobSeekerID = @JobSeekerID
            `);

        if (cvResult.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "CV not found."
            });
        }

        const cv = cvResult.recordset[0];

        // Check whether CV is being used by an application
        const applicationResult = await pool.request()
            .input("CVID", sql.Int, cvId)
            .query(`
                SELECT COUNT(*) AS ApplicationCount
                FROM Application
                WHERE CVID = @CVID
            `);

        const applicationCount =
            applicationResult.recordset[0].ApplicationCount;

        if (applicationCount > 0) {
            return res.status(409).json({
                success: false,
                message:
                    "This CV cannot be deleted because it is being used by an application."
            });
        }

        // Delete CV from database
        await pool.request()
            .input("CVID", sql.Int, cvId)
            .input("JobSeekerID", sql.Int, jobSeekerId)
            .query(`
                DELETE FROM CV
                WHERE CVID = @CVID
                AND JobSeekerID = @JobSeekerID
            `);

        // Delete physical file
        if (
            cv.FilePath &&
            fs.existsSync(cv.FilePath)
        ) {
            fs.unlinkSync(cv.FilePath);
        }

        return res.status(200).json({
            success: true,
            message: "CV deleted successfully."
        });

    } catch (error) {

        console.error("Delete CV error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete CV.",
            error: error.message
        });
    }
};


// =====================================================
// EXPORTS
// =====================================================
module.exports = {
    uploadCV,
    getMyCVs,
    getCV,
    deleteCV
};