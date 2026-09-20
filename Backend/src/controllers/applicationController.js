const { sql, connectDB } = require("../config/database");

const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { CVID } = req.body || {};

        // Get logged-in user's ID from JWT
        const userId = req.user.userId;

        // Validate Job ID
        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: "Job ID is required"
            });
        }

        // Validate CV ID
        if (!CVID) {
            return res.status(400).json({
                success: false,
                message: "CVID is required"
            });
        }

        // Get database connection
        const pool = await connectDB();
        // Check if the Job exists
const jobResult = await pool.request()

    .input("JobID", sql.Int, parseInt(jobId))
    .query(`
        SELECT JobID
        FROM Job
        WHERE JobID = @JobID
    `);

if (jobResult.recordset.length === 0) {
    return res.status(404).json({
        success: false,
        message: "Job not found"
    });
}

// Check if the job is still available
const availabilityResult = await pool.request()
    .input("JobID", sql.Int, parseInt(jobId))
    .query(`
        SELECT Status, ApplicationDeadline
        FROM Job
        WHERE JobID = @JobID
    `);

const job = availabilityResult.recordset[0];

if (job.Status !== true) {
    return res.status(400).json({
        success: false,
        message: "This job is closed and no longer accepting applications"
    });
}

if (new Date(job.ApplicationDeadline) < new Date()) {
    return res.status(400).json({
        success: false,
        message: "The application deadline for this job has passed"
    });
}

        // Find the JobSeekerID belonging to the logged-in UserID
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
                message: "Job seeker profile not found"
            });
        }

        const jobSeekerID = jobSeekerResult.recordset[0].JobSeekerID;

        // Insert the application
        await pool.request()
            .input("JobSeekerID", sql.Int, jobSeekerID)
            .input("JobID", sql.Int, parseInt(jobId))
            .input("CVID", sql.Int, parseInt(CVID))
            .input("ApplicationDate", sql.DateTime, new Date())
            .input("Status", sql.NVarChar(50), "Submitted")
            .query(`
                INSERT INTO Application
                (
                    JobSeekerID,
                    JobID,
                    CVID,
                    ApplicationDate,
                    Status
                )
                VALUES
                (
                    @JobSeekerID,
                    @JobID,
                    @CVID,
                    @ApplicationDate,
                    @Status
                )
            `);

        return res.status(201).json({
            success: true,
            message: "Job application submitted successfully"
        });

    } catch (error) {
        console.error("Apply for job error:", error);

        if (error.number === 547) {
            return res.status(400).json({
                success: false,
                message: "Invalid Job, Job Seeker or CV"
            });
        }

        if (error.number === 2601 || error.number === 2627) {
            return res.status(409).json({
                success: false,
                message: "You have already applied for this job"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to submit job application"
        });
    }
};

const getMyApplications = async (req, res) => {
    try {
        const userId = req.user.userId;

        const pool = await connectDB();

        const result = await pool.request()
            .input("UserID", sql.Int, userId)
            .query(`
                SELECT
                    Application.ApplicationID AS applicationId,
                    Application.JobID AS jobId,
                    Job.JobTitle AS jobTitle,
                    Company.CompanyName AS companyName,
                    Job.Location AS location,
                    Application.Status AS status,
                    Application.ApplicationDate AS appliedOn
                FROM Application
                INNER JOIN JobSeeker
                    ON Application.JobSeekerID = JobSeeker.JobSeekerID
                INNER JOIN Job
                    ON Application.JobID = Job.JobID
                INNER JOIN Company
                    ON Job.CompanyID = Company.CompanyID
                WHERE JobSeeker.UserID = @UserID
                ORDER BY Application.ApplicationDate DESC
            `);

        return res.status(200).json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });

    } catch (error) {
        console.error("Get my applications error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve applications"
        });
    }
};

const getApplicationById = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const userId = req.user.userId;

        const pool = await connectDB();

        const result = await pool.request()
            .input("ApplicationID", sql.Int, parseInt(applicationId))
            .input("UserID", sql.Int, userId)
            .query(`
                SELECT
                    Application.ApplicationID AS applicationId,
                    Application.JobID AS jobId,
                    Job.JobTitle AS jobTitle,
                    Company.CompanyName AS companyName,
                    Job.Location AS location,
                    Application.Status AS status,
                    Application.ApplicationDate AS appliedOn
                FROM Application
                INNER JOIN JobSeeker
                    ON Application.JobSeekerID = JobSeeker.JobSeekerID
                INNER JOIN Job
                    ON Application.JobID = Job.JobID
                INNER JOIN Company
                    ON Job.CompanyID = Company.CompanyID
                WHERE Application.ApplicationID = @ApplicationID
                  AND JobSeeker.UserID = @UserID
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Application not found or access denied"
            });
        }

        return res.status(200).json({
            success: true,
            data: result.recordset[0]
        });

    } catch (error) {
        console.error("Get application by ID error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve application"
        });
    }
};

const getJobApplicants = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const userId = req.user.userId;

        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: "Job ID is required"
            });
        }

        const pool = await connectDB();

        const jobResult = await pool.request()
            .input("JobID", sql.Int, parseInt(jobId))
            .query(`
                SELECT
                    Job.JobID,
                    Job.JobTitle,
                    Job.CompanyID
                FROM Job
                WHERE Job.JobID = @JobID
            `);

        if (jobResult.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        const job = jobResult.recordset[0];

        const ownershipResult = await pool.request()
            .input("CompanyID", sql.Int, job.CompanyID)
            .input("UserID", sql.Int, userId)
            .query(`
                SELECT CompanyID
                FROM Company
                WHERE CompanyID = @CompanyID
                  AND UserID = @UserID
            `);

        if (ownershipResult.recordset.length === 0) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view applicants for this job"
            });
        }

        const result = await pool.request()
            .input("JobID", sql.Int, parseInt(jobId))
            .query(`
                SELECT
                    Application.ApplicationID AS applicationId,
                    CONCAT([User].FirstName, ' ', [User].LastName) AS applicantName,
                    [User].Email AS email,
                    Application.Status AS status,
                    Application.ApplicationDate AS appliedOn
                FROM Application
                INNER JOIN JobSeeker
                    ON Application.JobSeekerID = JobSeeker.JobSeekerID
                INNER JOIN [User]
                    ON JobSeeker.UserID = [User].UserID
                WHERE Application.JobID = @JobID
                ORDER BY Application.ApplicationDate DESC
            `);

        return res.status(200).json({
            success: true,
            job: {
                jobId: job.JobID,
                title: job.JobTitle
            },
            count: result.recordset.length,
            data: result.recordset
        });

    } catch (error) {
        console.error("Get job applicants error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve job applicants"
        });
    }
};

const updateApplicationStatus = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const { status } = req.body || {};
        const userId = req.user.userId;

        if (!applicationId) {
            return res.status(400).json({
                success: false,
                message: "Application ID is required"
            });
        }

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }

        // PART V — STATUS VALIDATION
        const allowedStatuses = [
            "Submitted",
            "Reviewed",
            "Shortlisted",
            "Accepted",
            "Rejected"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid application status"
            });
        }

        const pool = await connectDB();

        // Check ownership and get current status
        const ownershipResult = await pool.request()
            .input("ApplicationID", sql.Int, parseInt(applicationId))
            .input("UserID", sql.Int, userId)
            .query(`
                SELECT
                    Application.ApplicationID,
                    Application.Status
                FROM Application
                INNER JOIN Job
                    ON Application.JobID = Job.JobID
                INNER JOIN Company
                    ON Job.CompanyID = Company.CompanyID
                WHERE Application.ApplicationID = @ApplicationID
                  AND Company.UserID = @UserID
            `);

        if (ownershipResult.recordset.length === 0) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this application"
            });
        }

        const currentStatus = ownershipResult.recordset[0].Status;

        // PART X — STATUS TRANSITION RULES
        const allowedTransitions = {
            Submitted: ["Reviewed", "Rejected"],
            Reviewed: ["Shortlisted", "Rejected"],
            Shortlisted: ["Accepted", "Rejected"],
            Accepted: [],
            Rejected: []
        };

        // Prevent same status
        if (currentStatus === status) {
            return res.status(400).json({
                success: false,
                message: `Application is already ${status}`
            });
        }

        // Check whether the transition is allowed
        const nextStatuses = allowedTransitions[currentStatus] || [];

        if (!nextStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status transition from ${currentStatus} to ${status}`
            });
        }

        // Update status
        await pool.request()
            .input("ApplicationID", sql.Int, parseInt(applicationId))
            .input("Status", sql.NVarChar(50), status)
            .query(`
                UPDATE Application
                SET Status = @Status
                WHERE ApplicationID = @ApplicationID
            `);

        return res.status(200).json({
            success: true,
            message: "Application status updated successfully",
            previousStatus: currentStatus,
            newStatus: status
        });

    } catch (error) {
        console.error("Update application status error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update application status"
        });
    }
};

module.exports = {
    applyForJob,
    getMyApplications,
    getApplicationById,
    getJobApplicants,
    updateApplicationStatus
};