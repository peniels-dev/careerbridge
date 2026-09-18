const { sql, connectDB } = require("../config/database");

const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { JobSeekerID, CVID } = req.body;

        // Check that JobSeekerID and CVID were provided
        if (!JobSeekerID || !CVID) {
            return res.status(400).json({
                message: "JobSeekerID and CVID are required"
            });
        }

        const pool = await connectDB();

        // Check if the job exists
        const jobResult = await pool.request()
            .input("JobID", sql.Int, jobId)
            .query(`
                SELECT JobID
                FROM Job
                WHERE JobID = @JobID
            `);

        if (jobResult.recordset.length === 0) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        // Check if the CV exists and belongs to the Job Seeker
        const cvResult = await pool.request()
            .input("CVID", sql.Int, CVID)
            .input("JobSeekerID", sql.Int, JobSeekerID)
            .query(`
                SELECT CVID
                FROM CV
                WHERE CVID = @CVID
                AND JobSeekerID = @JobSeekerID
            `);

        if (cvResult.recordset.length === 0) {
            return res.status(404).json({
                message: "CV not found for this Job Seeker"
            });
        }

        // Check if the Job Seeker has already applied
        const existingApplication = await pool.request()
            .input("JobSeekerID", sql.Int, JobSeekerID)
            .input("JobID", sql.Int, jobId)
            .query(`
                SELECT ApplicationID
                FROM Application
                WHERE JobSeekerID = @JobSeekerID
                AND JobID = @JobID
            `);

        if (existingApplication.recordset.length > 0) {
            return res.status(400).json({
                message: "You have already applied for this job"
            });
        }

        // Create the application
        await pool.request()
            .input("JobSeekerID", sql.Int, JobSeekerID)
            .input("JobID", sql.Int, jobId)
            .input("CVID", sql.Int, CVID)
            .query(`
                INSERT INTO Application
                (JobSeekerID, JobID, CVID, ApplicationDate, Status)
                VALUES
                (@JobSeekerID, @JobID, @CVID, GETDATE(), 'Pending')
            `);

        res.status(201).json({
            message: "Application submitted successfully"
        });

    } catch (error) {
        console.error("Apply for job error:", error);

        res.status(500).json({
            message: "Failed to submit application"
        });
    }
};

module.exports = {
    applyForJob
};