const { sql, connectDB } = require("../config/database");

// =====================================================
// APPLY FOR JOB
// =====================================================

const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user.userId;

        const { CVID, CoverLetter } = req.body;

        // -----------------------------
        // Basic validation
        // -----------------------------

        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: "Job ID is required"
            });
        }

        if (!CVID) {
            return res.status(400).json({
                success: false,
                message: "CV is required"
            });
        }

        if (!CoverLetter || CoverLetter.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Cover letter is required"
            });
        }

        const pool = await connectDB();

        // -----------------------------
        // Check job
        // -----------------------------

        const jobResult = await pool.request()
            .input(
                "JobID",
                sql.Int,
                parseInt(jobId)
            )
            .query(`
                SELECT
                    JobID,
                    Status,
                    ApplicationDeadline
                FROM Job
                WHERE JobID = @JobID
            `);

        if (jobResult.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        const job = jobResult.recordset[0];

        // Job must be active
        if (!job.Status) {
            return res.status(400).json({
                success: false,
                message: "This job is no longer accepting applications"
            });
        }

        // Check deadline
        if (
            job.ApplicationDeadline &&
            new Date(job.ApplicationDeadline) < new Date()
        ) {
            return res.status(400).json({
                success: false,
                message: "The application deadline has passed"
            });
        }

        // -----------------------------
        // Find JobSeeker
        // -----------------------------

        const jobSeekerResult = await pool.request()
            .input(
                "UserID",
                sql.Int,
                userId
            )
            .query(`
                SELECT JobSeekerID
                FROM JobSeeker
                WHERE UserID = @UserID
            `);

        if (jobSeekerResult.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "JobSeeker profile not found"
            });
        }

        const jobSeekerID =
            jobSeekerResult.recordset[0].JobSeekerID;

        // -----------------------------
        // Check that CV belongs to user
        // -----------------------------

        const cvResult = await pool.request()
            .input(
                "CVID",
                sql.Int,
                parseInt(CVID)
            )
            .input(
                "JobSeekerID",
                sql.Int,
                jobSeekerID
            )
            .query(`
                SELECT
                    CVID,
                    CVTitle,
                    FilePath
                FROM CV
                WHERE CVID = @CVID
                AND JobSeekerID = @JobSeekerID
            `);

        if (cvResult.recordset.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Selected CV was not found or does not belong to you"
            });
        }

        // -----------------------------
        // Prevent duplicate application
        // -----------------------------

        const duplicateResult = await pool.request()
            .input(
                "JobSeekerID",
                sql.Int,
                jobSeekerID
            )
            .input(
                "JobID",
                sql.Int,
                parseInt(jobId)
            )
            .query(`
                SELECT ApplicationID
                FROM Application
                WHERE JobSeekerID = @JobSeekerID
                AND JobID = @JobID
            `);

        if (duplicateResult.recordset.length > 0) {
            return res.status(409).json({
                success: false,
                message: "You have already applied for this job"
            });
        }

        // -----------------------------
        // Create application
        // -----------------------------

        const applicationResult = await pool.request()
            .input(
                "JobSeekerID",
                sql.Int,
                jobSeekerID
            )
            .input(
                "JobID",
                sql.Int,
                parseInt(jobId)
            )
            .input(
                "CVID",
                sql.Int,
                parseInt(CVID)
            )
            .input(
                "CoverLetter",
                sql.NVarChar(sql.MAX),
                CoverLetter.trim()
            )
            .query(`
                INSERT INTO Application
                (
                    JobSeekerID,
                    JobID,
                    CVID,
                    CoverLetter,
                    Status,
                    ApplicationDate
                )
                OUTPUT INSERTED.ApplicationID
                VALUES
                (
                    @JobSeekerID,
                    @JobID,
                    @CVID,
                    @CoverLetter,
                    'Submitted',
                    GETDATE()
                )
            `);

        return res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            data: {
                ApplicationID:
                    applicationResult.recordset[0].ApplicationID
            }
        });

    } catch (error) {
        console.error("Apply for job error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to submit job application"
        });
    }
};

// =====================================================
// GET MY APPLICATIONS
// =====================================================

const getMyApplications = async (req, res) => {
    try {
        const userId = req.user.userId;

        const pool = await connectDB();

        const result = await pool
            .request()
            .input(
                "UserID",
                sql.Int,
                userId
            )
            .query(`
                SELECT
                    A.ApplicationID AS applicationId,
                    J.JobID AS jobId,
                    J.JobTitle AS jobTitle,
                    C.CompanyName AS companyName,
                    J.Location AS location,
                    A.CVID AS cvId,
                    CV.CVTitle AS cvTitle,
                    CV.FilePath AS cvPath,
                    A.CoverLetter AS coverLetter,
                    A.Status AS status,
                    A.ApplicationDate AS appliedOn
                FROM Application A
                INNER JOIN JobSeeker JS
                    ON A.JobSeekerID = JS.JobSeekerID
                INNER JOIN Job J
                    ON A.JobID = J.JobID
                INNER JOIN Company C
                    ON J.CompanyID = C.CompanyID
                LEFT JOIN CV
                    ON A.CVID = CV.CVID
                WHERE JS.UserID = @UserID
                ORDER BY A.ApplicationDate DESC
            `);

        return res.status(200).json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error(
            "Get my applications error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve applications"
        });
    }
};

// =====================================================
// GET APPLICATION BY ID
// =====================================================

const getApplicationById = async (req, res) => {
    try {
        const applicationId = parseInt(req.params.id);
        const userId = req.user.userId;

        if (isNaN(applicationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid application ID"
            });
        }

        const pool = await connectDB();

        const result = await pool
            .request()
            .input(
                "ApplicationID",
                sql.Int,
                applicationId
            )
            .input(
                "UserID",
                sql.Int,
                userId
            )
            .query(`
                SELECT
                    A.ApplicationID AS applicationId,
                    J.JobID AS jobId,
                    J.JobTitle AS jobTitle,
                    C.CompanyName AS companyName,
                    J.Location AS location,
                    A.CVID AS cvId,
                    CV.CVTitle AS cvTitle,
                    CV.FilePath AS cvPath,
                    A.CoverLetter AS coverLetter,
                    A.Status AS status,
                    A.ApplicationDate AS appliedOn
                FROM Application A
                INNER JOIN JobSeeker JS
                    ON A.JobSeekerID = JS.JobSeekerID
                INNER JOIN Job J
                    ON A.JobID = J.JobID
                INNER JOIN Company C
                    ON J.CompanyID = C.CompanyID
                LEFT JOIN CV
                    ON A.CVID = CV.CVID
                WHERE A.ApplicationID = @ApplicationID
                AND JS.UserID = @UserID
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: result.recordset[0]
        });

    } catch (error) {
        console.error(
            "Get application error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve application"
        });
    }
};

// =====================================================
// GET JOB APPLICANTS
// =====================================================

// =====================================================
// GET JOB APPLICANTS
// =====================================================

const getJobApplicants = async (req, res) => {
    try {
        // Get the JobID from the URL
        const jobId = parseInt(req.params.jobId);

        // Get the logged-in employer's UserID from the JWT
        const userId = req.user.userId;

        // Validate JobID
        if (isNaN(jobId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid job ID"
            });
        }

        // Make sure we have an authenticated user
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const pool = await connectDB();

        // =====================================================
        // CALL STORED PROCEDURE
        // =====================================================
        const result = await pool
            .request()
            .input("JobID", sql.Int, jobId)
            .input("UserID", sql.Int, userId)
            .execute("dbo.uspGetJobApplicants");

        // =====================================================
        // CHECK IF THE EMPLOYER OWNS THE JOB
        // =====================================================

        // When the job does not belong to the employer,
        // the procedure returns a message instead of applicants.
        if (
            result.recordsets.length === 1 &&
            result.recordsets[0][0]?.Success === false
        ) {
            return res.status(404).json({
                success: false,
                message:
                    result.recordsets[0][0].Message ||
                    "Job not found or you are not authorized to view its applicants"
            });
        }

        // =====================================================
        // GET THE TWO RESULT SETS
        // =====================================================

        const job = result.recordsets[0]?.[0] || null;

        const applicants =
            result.recordsets[1] || [];

        // =====================================================
        // RETURN RESPONSE
        // =====================================================

        return res.status(200).json({
            success: true,
            data: {
                job,
                applicants
            }
        });

    } catch (error) {
        console.error(
            "Get job applicants error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve applicants"
        });
    }
};

// =====================================================
// VIEW APPLICANT CV
// =====================================================

const viewApplicantCV = async (req, res) => {
    try {
        const applicationId = parseInt(req.params.id);
        const userId = req.user.userId;

        if (isNaN(applicationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid application ID"
            });
        }

        const pool = await connectDB();

        // Make sure the application belongs to a job
        // owned by the logged-in employer
        const result = await pool.request()
            .input(
                "ApplicationID",
                sql.Int,
                applicationId
            )
            .input(
                "UserID",
                sql.Int,
                userId
            )
            .query(`
                SELECT
                    CV.FilePath,
                    CV.CVTitle
                FROM Application A

                INNER JOIN Job J
                    ON A.JobID = J.JobID

                INNER JOIN Company C
                    ON J.CompanyID = C.CompanyID

                INNER JOIN CV
                    ON A.CVID = CV.CVID

                WHERE A.ApplicationID = @ApplicationID
                AND C.UserID = @UserID
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "CV not found or you are not authorized to view it"
            });
        }

        const filePath =
            result.recordset[0].FilePath;

        const cvTitle =
            result.recordset[0].CVTitle ||
            "CV";

        const fs = require("fs");
        const path = require("path");

        if (!filePath || !fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: "CV file could not be found"
            });
        }

        const extension =
            path.extname(filePath).toLowerCase();

        let contentType =
            "application/octet-stream";

        if (extension === ".pdf") {
            contentType = "application/pdf";
        } else if (extension === ".doc") {
            contentType = "application/msword";
        } else if (extension === ".docx") {
            contentType =
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        }

        res.setHeader(
            "Content-Type",
            contentType
        );

        res.setHeader(
            "Content-Disposition",
            `inline; filename="${cvTitle}${extension}"`
        );

        return res.sendFile(
            path.resolve(filePath)
        );

    } catch (error) {
        console.error(
            "View applicant CV error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to open CV"
        });
    }
};
// =====================================================
// UPDATE APPLICATION STATUS
// =====================================================

const updateApplicationStatus = async (req, res) => {
    try {
        const applicationId = parseInt(req.params.id);
        const userId = req.user.userId;
        const { status: newStatus } = req.body;

        // =====================================================
        // VALIDATE APPLICATION ID
        // =====================================================

        if (isNaN(applicationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid application ID"
            });
        }

        // =====================================================
        // VALIDATE STATUS
        // =====================================================

        const allowedStatuses = [
            "Submitted",
            "Reviewed",
            "Shortlisted",
            "Accepted",
            "Rejected"
        ];

        if (!allowedStatuses.includes(newStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid application status"
            });
        }

        const pool = await connectDB();

        // =====================================================
        // GET CURRENT APPLICATION
        // ALSO CHECK EMPLOYER OWNERSHIP
        // =====================================================

        const applicationResult = await pool.request()
            .input(
                "ApplicationID",
                sql.Int,
                applicationId
            )
            .input(
                "UserID",
                sql.Int,
                userId
            )
            .query(`
                SELECT
                    A.ApplicationID,
                    A.Status AS CurrentStatus,
                    J.JobID,
                    C.CompanyID,
                    C.UserID AS CompanyUserID
                FROM Application A

                INNER JOIN Job J
                    ON A.JobID = J.JobID

                INNER JOIN Company C
                    ON J.CompanyID = C.CompanyID

                WHERE A.ApplicationID = @ApplicationID
                AND C.UserID = @UserID
            `);

        // =====================================================
        // APPLICATION NOT FOUND / NOT OWNED
        // =====================================================

        if (applicationResult.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "Application not found or you are not authorized to update it"
            });
        }

        const application =
            applicationResult.recordset[0];

        const currentStatus =
            application.CurrentStatus;

        // =====================================================
        // DON'T UPDATE TO SAME STATUS
        // =====================================================

        if (currentStatus === newStatus) {
            return res.status(400).json({
                success: false,
                message:
                    `Application is already "${currentStatus}"`
            });
        }

        // =====================================================
        // FINAL STATUSES CANNOT BE CHANGED
        // =====================================================

        if (
            currentStatus === "Accepted" ||
            currentStatus === "Rejected"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `This application has already been ${currentStatus.toLowerCase()} and cannot be changed.`
            });
        }

        // =====================================================
        // STATUS TRANSITION RULES
        // =====================================================

        const allowedTransitions = {
            Submitted: ["Reviewed"],
            Reviewed: ["Shortlisted"],
            Shortlisted: [
                "Accepted",
                "Rejected"
            ]
        };

        const nextStatuses =
            allowedTransitions[currentStatus] || [];

        if (!nextStatuses.includes(newStatus)) {
            return res.status(400).json({
                success: false,
                message:
                    `You cannot change an application from "${currentStatus}" to "${newStatus}".`
            });
        }

        // =====================================================
        // UPDATE STATUS
        // =====================================================

        await pool.request()
            .input(
                "ApplicationID",
                sql.Int,
                applicationId
            )
            .input(
                "Status",
                sql.VarChar(50),
                newStatus
            )
            .query(`
                UPDATE Application
                SET Status = @Status
                WHERE ApplicationID = @ApplicationID
            `);

        return res.status(200).json({
            success: true,
            message:
                `Application status changed from "${currentStatus}" to "${newStatus}".`,
            data: {
                ApplicationID: applicationId,
                previousStatus: currentStatus,
                status: newStatus
            }
        });

    } catch (error) {
        console.error(
            "Update application status error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to update application status"
        });
    }
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
    applyForJob,
    getMyApplications,
    getApplicationById,
    getJobApplicants,
    viewApplicantCV,
    updateApplicationStatus
};