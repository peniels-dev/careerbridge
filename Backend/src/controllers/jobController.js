const { sql, connectDB } = require("../config/database");

// ======================================================
// GET ALL JOBS
// ======================================================

const getAllJobs = async (req, res) => {
    try {
        const {
            search,
            location,
            jobType,
            categoryId,
            status,
            sort,
        } = req.query;

        const pool = await connectDB();

        const request = pool.request();

        // --------------------------------------------------
        // SEARCH
        // --------------------------------------------------

        request.input(
            "Search",
            sql.NVarChar(200),
            search?.trim() || null
        );

        // --------------------------------------------------
        // LOCATION
        // --------------------------------------------------

        request.input(
            "Location",
            sql.NVarChar(200),
            location?.trim() || null
        );

        // --------------------------------------------------
        // JOB TYPE
        // --------------------------------------------------

        request.input(
            "JobType",
            sql.NVarChar(100),
            jobType?.trim() || null
        );

        // --------------------------------------------------
        // CATEGORY
        // --------------------------------------------------

        let categoryValue = null;

        if (
            categoryId !== undefined &&
            categoryId !== null &&
            categoryId !== ""
        ) {
            const parsedCategory = Number(categoryId);

            if (!Number.isInteger(parsedCategory)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid category ID.",
                });
            }

            categoryValue = parsedCategory;
        }

        request.input(
            "CategoryID",
            sql.Int,
            categoryValue
        );

        // --------------------------------------------------
        // STATUS
        // --------------------------------------------------

        let statusValue = null;

        if (status !== undefined) {
            if (
                status === "1" ||
                status === "true"
            ) {
                statusValue = true;
            } else if (
                status === "0" ||
                status === "false"
            ) {
                statusValue = false;
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid job status.",
                });
            }
        }

        request.input(
            "Status",
            sql.Bit,
            statusValue
        );

        // --------------------------------------------------
        // SORT
        // --------------------------------------------------

        const allowedSorts = [
            "newest",
            "oldest",
            "title_asc",
            "title_desc",
            "deadline",
        ];

        const selectedSort =
            sort?.trim() || "newest";

        if (!allowedSorts.includes(selectedSort)) {
            return res.status(400).json({
                success: false,
                message: "Invalid sort option.",
            });
        }

        request.input(
            "Sort",
            sql.NVarChar(30),
            selectedSort
        );

        // --------------------------------------------------
        // EXECUTE STORED PROCEDURE
        // --------------------------------------------------

        const result = await request.execute(
            "dbo.uspJobsGet"
        );

        // --------------------------------------------------
        // RESPONSE
        // --------------------------------------------------

        return res.json({
            success: true,
            count: result.recordset.length,
            data: result.recordset,
        });

    } catch (error) {
        console.error(
            "Get all jobs error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve jobs",
        });
    }
};


// ======================================================
// SORT JOBS
// ======================================================

const sortJobs = async (req, res) => {
    try {
        const {
            sort = "newest",
        } = req.query;

        const allowedSorts = [
            "newest",
            "oldest",
            "title_asc",
            "title_desc",
            "deadline",
        ];

        if (!allowedSorts.includes(sort)) {
            return res.status(400).json({
                success: false,
                message: "Invalid sort option.",
            });
        }

        const pool = await connectDB();

        const result = await pool
            .request()
            .input(
                "Search",
                sql.NVarChar(200),
                null
            )
            .input(
                "Location",
                sql.NVarChar(200),
                null
            )
            .input(
                "JobType",
                sql.NVarChar(100),
                null
            )
            .input(
                "CategoryID",
                sql.Int,
                null
            )
            .input(
                "Status",
                sql.Bit,
                null
            )
            .input(
                "Sort",
                sql.NVarChar(30),
                sort
            )
            .execute("dbo.uspJobsGet");

        return res.json({
            success: true,
            count: result.recordset.length,
            data: result.recordset,
        });

    } catch (error) {
        console.error(
            "Sort jobs error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to sort jobs",
        });
    }
};


// ======================================================
// GET ACTIVE JOBS
// ======================================================

// ======================================================
// GET ACTIVE JOBS
// ======================================================

const getActiveJobs = async (req, res) => {
    try {
        const {
            search,
            location,
            jobType,
            categoryId,
            sort,
        } = req.query;

        // --------------------------------------------------
        // VALIDATE CATEGORY
        // --------------------------------------------------

        let categoryValue = null;

        if (
            categoryId !== undefined &&
            categoryId !== null &&
            categoryId !== ""
        ) {
            const parsedCategory = Number(categoryId);

            if (!Number.isInteger(parsedCategory)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid category ID.",
                });
            }

            categoryValue = parsedCategory;
        }

        // --------------------------------------------------
        // VALIDATE SORT
        // --------------------------------------------------

        const allowedSorts = [
            "newest",
            "oldest",
            "title_asc",
            "title_desc",
            "deadline",
        ];

        const selectedSort =
            sort?.trim() || "newest";

        if (!allowedSorts.includes(selectedSort)) {
            return res.status(400).json({
                success: false,
                message: "Invalid sort option.",
            });
        }

        // --------------------------------------------------
        // CONNECT TO DATABASE
        // --------------------------------------------------

        const pool = await connectDB();

        // --------------------------------------------------
        // GET ACTIVE JOBS
        // --------------------------------------------------

        const result = await pool
            .request()
            .input(
                "Search",
                sql.NVarChar(200),
                search?.trim() || null
            )
            .input(
                "Location",
                sql.NVarChar(200),
                location?.trim() || null
            )
            .input(
                "JobType",
                sql.NVarChar(100),
                jobType?.trim() || null
            )
            .input(
                "CategoryID",
                sql.Int,
                categoryValue
            )
            .input(
                "Sort",
                sql.NVarChar(30),
                selectedSort
            )
            .execute("dbo.uspJobsGetActive");

        // --------------------------------------------------
        // RESPONSE
        // --------------------------------------------------

        return res.json({
            success: true,
            count: result.recordset.length,
            data: result.recordset,
        });

    } catch (error) {
        console.error(
            "Get active jobs error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to retrieve active jobs",
        });
    }
};


// ======================================================
// FILTER JOBS
// ======================================================

const filterJobs = async (req, res) => {
    try {
        const {
            categoryId,
            location,
            jobType,
            status,
        } = req.query;

        let categoryValue = null;

        if (
            categoryId !== undefined &&
            categoryId !== ""
        ) {
            const parsedCategory = Number(categoryId);

            if (!Number.isInteger(parsedCategory)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid category ID.",
                });
            }

            categoryValue = parsedCategory;
        }

        let statusValue = null;

        if (status !== undefined) {
            if (
                status === "1" ||
                status === "true"
            ) {
                statusValue = true;
            } else if (
                status === "0" ||
                status === "false"
            ) {
                statusValue = false;
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status.",
                });
            }
        }

        const pool = await connectDB();

        const result = await pool
            .request()
            .input(
                "Search",
                sql.NVarChar(200),
                null
            )
            .input(
                "Location",
                sql.NVarChar(200),
                location?.trim() || null
            )
            .input(
                "JobType",
                sql.NVarChar(100),
                jobType?.trim() || null
            )
            .input(
                "CategoryID",
                sql.Int,
                categoryValue
            )
            .input(
                "Status",
                sql.Bit,
                statusValue
            )
            .input(
                "Sort",
                sql.NVarChar(30),
                "newest"
            )
            .execute("dbo.uspJobsGet");

        return res.json({
            success: true,
            count: result.recordset.length,
            data: result.recordset,
        });

    } catch (error) {
        console.error(
            "Filter jobs error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to filter jobs",
        });
    }
};


// ======================================================
// SEARCH JOBS
// ======================================================

const searchJobs = async (req, res) => {
    try {
        const {
            keyword,
        } = req.query;

        if (
            !keyword ||
            !keyword.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Search keyword is required",
            });
        }

        const pool = await connectDB();

        const result = await pool
            .request()
            .input(
                "Search",
                sql.NVarChar(200),
                keyword.trim()
            )
            .input(
                "Location",
                sql.NVarChar(200),
                null
            )
            .input(
                "JobType",
                sql.NVarChar(100),
                null
            )
            .input(
                "CategoryID",
                sql.Int,
                null
            )
            .input(
                "Status",
                sql.Bit,
                null
            )
            .input(
                "Sort",
                sql.NVarChar(30),
                "newest"
            )
            .execute("dbo.uspJobsGet");

        return res.json({
            success: true,
            count: result.recordset.length,
            data: result.recordset,
        });

    } catch (error) {
        console.error(
            "Search jobs error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to search jobs",
        });
    }
};


// ======================================================
// PAGINATE JOBS
// ======================================================

const paginateJobs = async (req, res) => {
    try {
        const page = Math.max(
            Number(req.query.page) || 1,
            1
        );

        const limit = Math.max(
            Number(req.query.limit) || 10,
            1
        );

        const offset = (page - 1) * limit;

        const pool = await connectDB();

        const countResult = await pool
            .request()
            .query(`
                SELECT COUNT(*) AS total
                FROM Job
            `);

        const total =
            countResult.recordset[0].total;

        const result = await pool
            .request()
            .input(
                "Offset",
                sql.Int,
                offset
            )
            .input(
                "Limit",
                sql.Int,
                limit
            )
            .query(`
                SELECT
                    j.JobID,
                    j.CompanyID,
                    j.CategoryID,
                    j.JobTitle,
                    j.Description,
                    j.Location,
                    j.JobType,
                    j.PostedDate,
                    j.ApplicationDeadline,
                    j.Status,
                    c.CompanyName,
                    cat.CategoryName

                FROM Job j

                INNER JOIN Company c
                    ON j.CompanyID = c.CompanyID

                INNER JOIN Category cat
                    ON j.CategoryID = cat.CategoryID

                ORDER BY j.PostedDate DESC

                OFFSET @Offset ROWS

                FETCH NEXT @Limit ROWS ONLY
            `);

        return res.json({
            success: true,
            data: result.recordset,
            pagination: {
                page,
                limit,
                total,
                totalPages:
                    Math.ceil(total / limit),
            },
        });

    } catch (error) {
        console.error(
            "Paginate jobs error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to paginate jobs",
        });
    }
};


// ======================================================
// GET JOB BY ID
// ======================================================

const getJobById = async (req, res) => {
    try {
        const jobId =
            Number(req.params.id);

        if (!Number.isInteger(jobId) || jobId <= 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Valid Job ID is required",
            });
        }

        const pool = await connectDB();

        const result = await pool
            .request()
            .input(
                "JobID",
                sql.Int,
                jobId
            )
            .query(`
                SELECT
                    j.JobID,
                    j.CompanyID,
                    j.CategoryID,
                    j.JobTitle,
                    j.Description,
                    j.Location,
                    j.JobType,
                    j.PostedDate,
                    j.ApplicationDeadline,
                    j.Status,

                    c.CompanyName,
                    c.Email AS CompanyEmail,
                    c.Phone AS CompanyPhone,
                    c.Address AS CompanyAddress,
                    c.Description AS CompanyDescription,
                    c.CompanyWebsite,

                    cat.CategoryName

                FROM Job j

                INNER JOIN Company c
                    ON j.CompanyID = c.CompanyID

                INNER JOIN Category cat
                    ON j.CategoryID = cat.CategoryID

                WHERE j.JobID = @JobID
            `);

        if (
            result.recordset.length === 0
        ) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        return res.json({
            success: true,
            data: result.recordset[0],
        });

    } catch (error) {
        console.error(
            "Get job by ID error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to retrieve job",
        });
    }
};


// ======================================================
// CREATE JOB
// ======================================================

const createJob = async (req, res) => {
    try {
        console.log("");
        console.log(
            "======================================"
        );
        console.log(
            "CREATE JOB REQUEST RECEIVED"
        );
        console.log(
            "======================================"
        );

        console.log("REQUEST BODY:");
        console.log(req.body);

        console.log("AUTHENTICATED USER:");
        console.log(req.user);

        console.log(
            "======================================"
        );

        // --------------------------------------------------
        // NORMALIZE REQUEST DATA
        // --------------------------------------------------

        const JobTitle =
            req.body.JobTitle ??
            req.body.jobTitle;

        const CategoryID =
            req.body.CategoryID ??
            req.body.categoryId;

        const Description =
            req.body.Description ??
            req.body.description;

        const Location =
            req.body.Location ??
            req.body.location;

        const JobType =
            req.body.JobType ??
            req.body.jobType;

        const ApplicationDeadline =
            req.body.ApplicationDeadline ??
            req.body.applicationDeadline;

        // --------------------------------------------------
        // VALIDATE REQUIRED FIELDS
        // --------------------------------------------------

        const missingFields = [];

        if (
            JobTitle === undefined ||
            JobTitle === null ||
            String(JobTitle).trim() === ""
        ) {
            missingFields.push("JobTitle");
        }

        if (
            CategoryID === undefined ||
            CategoryID === null ||
            CategoryID === ""
        ) {
            missingFields.push("CategoryID");
        }

        if (
            Description === undefined ||
            Description === null ||
            String(Description).trim() === ""
        ) {
            missingFields.push("Description");
        }

        if (
            Location === undefined ||
            Location === null ||
            String(Location).trim() === ""
        ) {
            missingFields.push("Location");
        }

        if (
            JobType === undefined ||
            JobType === null ||
            String(JobType).trim() === ""
        ) {
            missingFields.push("JobType");
        }

        if (
            ApplicationDeadline === undefined ||
            ApplicationDeadline === null ||
            String(ApplicationDeadline).trim() === ""
        ) {
            missingFields.push(
                "ApplicationDeadline"
            );
        }

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Some job fields are missing.",
                missingFields,
            });
        }

        // --------------------------------------------------
        // VALIDATE AUTHENTICATION
        // --------------------------------------------------

        if (
            !req.user ||
            !req.user.userId
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Authenticated employer information is missing.",
            });
        }

        // --------------------------------------------------
        // VALIDATE CATEGORY
        // --------------------------------------------------

        const categoryIDNumber =
            Number(CategoryID);

        if (
            !Number.isInteger(
                categoryIDNumber
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid job category.",
            });
        }

        // --------------------------------------------------
        // CONNECT TO DATABASE
        // --------------------------------------------------

        const pool = await connectDB();

        // --------------------------------------------------
        // CREATE JOB USING STORED PROCEDURE
        // --------------------------------------------------

        const result = await pool
            .request()
            .input(
                "UserID",
                sql.Int,
                Number(req.user.userId)
            )
            .input(
                "CategoryID",
                sql.Int,
                categoryIDNumber
            )
            .input(
                "JobTitle",
                sql.NVarChar(200),
                String(JobTitle).trim()
            )
            .input(
                "Description",
                sql.NVarChar(sql.MAX),
                String(Description).trim()
            )
            .input(
                "Location",
                sql.NVarChar(200),
                String(Location).trim()
            )
            .input(
                "JobType",
                sql.NVarChar(100),
                String(JobType).trim()
            )
            .input(
                "ApplicationDeadline",
                sql.Date,
                ApplicationDeadline
            )
            .execute("dbo.uspJobCreate");

        const procedureResult =
            result.recordset[0];

        if (
            !procedureResult ||
            procedureResult.Success !== 1
        ) {
            return res.status(400).json({
                success: false,
                message:
                    procedureResult?.Message ||
                    "Unable to create job.",
            });
        }

        return res.status(201).json({
            success: true,
            message:
                procedureResult.Message ||
                "Job posted successfully!",
        });

    } catch (error) {
        console.error(
            "CREATE JOB DATABASE ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to create job.",
            error:
                process.env.NODE_ENV ===
                "development"
                    ? error.message
                    : undefined,
        });
    }
};


// ======================================================
// UPDATE JOB
// ======================================================

const updateJob = async (req, res) => {
    try {
        const jobId =
            Number(req.params.id);

        if (
            !Number.isInteger(jobId) ||
            jobId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Valid Job ID is required",
            });
        }

        const JobTitle =
            req.body.JobTitle ??
            req.body.jobTitle;

        const CategoryID =
            req.body.CategoryID ??
            req.body.categoryId;

        const Description =
            req.body.Description ??
            req.body.description;

        const Location =
            req.body.Location ??
            req.body.location;

        const JobType =
            req.body.JobType ??
            req.body.jobType;

        const ApplicationDeadline =
            req.body.ApplicationDeadline ??
            req.body.applicationDeadline;

        if (
            !JobTitle ||
            !CategoryID ||
            !Description ||
            !Location ||
            !JobType ||
            !ApplicationDeadline
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "All job fields are required",
            });
        }

        const pool = await connectDB();

        // --------------------------------------------------
        // CHECK OWNERSHIP
        // --------------------------------------------------

        const ownershipResult =
            await pool
                .request()
                .input(
                    "JobID",
                    sql.Int,
                    jobId
                )
                .input(
                    "UserID",
                    sql.Int,
                    Number(req.user.userId)
                )
                .query(`
                    SELECT j.JobID

                    FROM Job j

                    INNER JOIN Company c
                        ON j.CompanyID = c.CompanyID

                    WHERE
                        j.JobID = @JobID
                        AND c.UserID = @UserID
                `);

        if (
            ownershipResult.recordset
                .length === 0
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to update this job.",
            });
        }

        // --------------------------------------------------
        // UPDATE JOB
        // --------------------------------------------------

        await pool
            .request()
            .input(
                "JobID",
                sql.Int,
                jobId
            )
            .input(
                "CategoryID",
                sql.Int,
                Number(CategoryID)
            )
            .input(
                "JobTitle",
                sql.NVarChar(255),
                String(JobTitle).trim()
            )
            .input(
                "Description",
                sql.NVarChar(sql.MAX),
                String(Description).trim()
            )
            .input(
                "Location",
                sql.NVarChar(255),
                String(Location).trim()
            )
            .input(
                "JobType",
                sql.NVarChar(100),
                String(JobType).trim()
            )
            .input(
                "ApplicationDeadline",
                sql.Date,
                ApplicationDeadline
            )
            .query(`
                UPDATE Job

                SET
                    CategoryID = @CategoryID,
                    JobTitle = @JobTitle,
                    Description = @Description,
                    Location = @Location,
                    JobType = @JobType,
                    ApplicationDeadline =
                        @ApplicationDeadline

                WHERE JobID = @JobID
            `);

        return res.json({
            success: true,
            message:
                "Job updated successfully!",
        });

    } catch (error) {
        console.error(
            "Update job error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to update job",
        });
    }
};


// ======================================================
// CLOSE JOB
// ======================================================

const closeJob = async (req, res) => {
    try {
        const jobId =
            Number(req.params.id);

        if (
            !Number.isInteger(jobId) ||
            jobId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Valid Job ID is required",
            });
        }

        if (
            !req.user ||
            !req.user.userId
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Authentication required",
            });
        }

        const userId =
            Number(req.user.userId);

        const pool = await connectDB();

        const result = await pool
            .request()
            .input(
                "JobID",
                sql.Int,
                jobId
            )
            .input(
                "UserID",
                sql.Int,
                userId
            )
            .execute("dbo.uspJobClose");

        const response =
            result.recordset[0];

        if (!response) {
            return res.status(500).json({
                success: false,
                message:
                    "Unable to close job",
            });
        }

        if (
            response.Success === false ||
            response.Success === 0
        ) {
            return res.status(403).json({
                success: false,
                message:
                    response.Message,
            });
        }

        return res.status(200).json({
            success: true,
            message:
                response.Message,
        });

    } catch (error) {
        console.error(
            "Close job error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to close job",
        });
    }
};


// ======================================================
// GET EMPLOYER JOBS
// ======================================================

const getEmployerJobs = async (req, res) => {
    try {
        if (
            !req.user ||
            !req.user.userId
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Authenticated employer information is missing.",
            });
        }

        const userID =
            Number(req.user.userId);

        const pool = await connectDB();

        // --------------------------------------------------
        // DASHBOARD STATISTICS
        // --------------------------------------------------

        const dashboardResult =
            await pool
                .request()
                .input(
                    "UserID",
                    sql.Int,
                    userID
                )
                .execute(
                    "dbo.uspEmployerDashboard"
                );

        const statisticsResult =
            dashboardResult.recordset[0];

        // --------------------------------------------------
        // COMPANY
        // --------------------------------------------------

        const companyResult =
            await pool
                .request()
                .input(
                    "UserID",
                    sql.Int,
                    userID
                )
                .query(`
                    SELECT
                        CompanyID,
                        CompanyName,
                        Email,
                        Phone,
                        Address,
                        Description,
                        CompanyWebsite,
                        CompanyLogo,
                        Status

                    FROM Company

                    WHERE UserID = @UserID
                `);

        if (
            companyResult.recordset
                .length === 0
        ) {
            return res.status(404).json({
                success: false,
                message:
                    "No company is linked to your employer account.",
            });
        }

        const company =
            companyResult.recordset[0];

        // --------------------------------------------------
        // EMPLOYER JOBS
        // --------------------------------------------------

        const jobsResult =
            await pool
                .request()
                .input(
                    "UserID",
                    sql.Int,
                    userID
                )
                .execute(
                    "dbo.uspEmployerJobs"
                );

        const jobs =
            jobsResult.recordset;

        // --------------------------------------------------
        // STATISTICS
        // --------------------------------------------------

        const totalJobs =
            Number(
                statisticsResult?.TotalJobs ||
                0
            );

        const openJobs =
            Number(
                statisticsResult?.OpenJobs ||
                0
            );

        const totalApplications =
            Number(
                statisticsResult
                    ?.TotalApplications ||
                0
            );

        const closedJobs =
            totalJobs - openJobs;

        // --------------------------------------------------
        // RESPONSE
        // --------------------------------------------------

        return res.json({
            success: true,

            data: {
                company,

                statistics: {
                    totalJobs,
                    openJobs,
                    closedJobs,
                    totalApplications,
                },

                jobs,
            },
        });

    } catch (error) {
        console.error(
            "Get employer jobs error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to retrieve employer jobs",
        });
    }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    getAllJobs,
    sortJobs,
    getActiveJobs,
    filterJobs,
    searchJobs,
    paginateJobs,
    getJobById,
    createJob,
    updateJob,
    closeJob,
    getEmployerJobs,
};