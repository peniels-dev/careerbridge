const { sql, connectDB } = require("../config/database");

// ==========================================
// GET ALL JOBS
// Supports:
// - Search
// - Location
// - Job Type
// - Category
// - Sorting
// ==========================================

const getAllJobs = async (req, res) => {
    try {
        const {
            search,
            location,
            jobType,
            categoryId,
            sort
        } = req.query;

        const pool = await connectDB();

        let query = `
            SELECT
                j.JobID,
                j.CompanyID,
                c.CompanyName,
                j.CategoryID,
                cat.CategoryName,
                j.JobTitle,
                j.Description,
                j.Location,
                j.JobType,
                j.PostedDate,
                j.ApplicationDeadline,
                j.Status
            FROM Job j
            INNER JOIN Company c
                ON j.CompanyID = c.CompanyID
            INNER JOIN Category cat
                ON j.CategoryID = cat.CategoryID
            WHERE 1 = 1
        `;

        const request = pool.request();

        // SEARCH
        if (search && search.trim()) {
            query += `
                AND (
                    j.JobTitle LIKE @Search
                    OR j.Description LIKE @Search
                    OR j.Location LIKE @Search
                    OR c.CompanyName LIKE @Search
                    OR cat.CategoryName LIKE @Search
                )
            `;

            request.input(
                "Search",
                sql.VarChar,
                `%${search.trim()}%`
            );
        }

        // LOCATION
        if (location && location.trim()) {
            query += `
                AND j.Location LIKE @Location
            `;

            request.input(
                "Location",
                sql.VarChar,
                `%${location.trim()}%`
            );
        }

        // JOB TYPE
        if (jobType && jobType.trim()) {
            query += `
                AND j.JobType LIKE @JobType
            `;

            request.input(
                "JobType",
                sql.VarChar,
                `%${jobType.trim()}%`
            );
        }

        // CATEGORY
        if (categoryId) {
            query += `
                AND j.CategoryID = @CategoryID
            `;

            request.input(
                "CategoryID",
                sql.Int,
                categoryId
            );
        }

        // SORT
        if (sort === "oldest") {
            query += `
                ORDER BY j.PostedDate ASC
            `;
        } else {
            query += `
                ORDER BY j.PostedDate DESC
            `;
        }

        const result = await request.query(query);

        res.status(200).json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error("Get all jobs error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve jobs"
        });
    }
};


// ==========================================
// SORT JOBS
// ==========================================

const sortJobs = async (req, res) => {
    try {
        const { sort } = req.query;

        let orderBy;

        if (sort === "newest") {
            orderBy = "DESC";
        } else if (sort === "oldest") {
            orderBy = "ASC";
        } else {
            return res.status(400).json({
                success: false,
                message: "Sort must be either newest or oldest"
            });
        }

        const pool = await connectDB();

        const result = await pool.request().query(`
            SELECT
                j.JobID,
                j.CompanyID,
                c.CompanyName,
                j.CategoryID,
                cat.CategoryName,
                j.JobTitle,
                j.Description,
                j.Location,
                j.JobType,
                j.PostedDate,
                j.ApplicationDeadline,
                j.Status
            FROM Job j
            INNER JOIN Company c
                ON j.CompanyID = c.CompanyID
            INNER JOIN Category cat
                ON j.CategoryID = cat.CategoryID
            ORDER BY j.PostedDate ${orderBy}
        `);

        res.status(200).json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error("Sort jobs error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to sort jobs"
        });
    }
};


// ==========================================
// GET ACTIVE JOBS
// ==========================================

const getActiveJobs = async (req, res) => {
    try {
        const pool = await connectDB();

        const result = await pool.request().query(`
            SELECT
                j.JobID,
                j.CompanyID,
                c.CompanyName,
                j.CategoryID,
                cat.CategoryName,
                j.JobTitle,
                j.Description,
                j.Location,
                j.JobType,
                j.PostedDate,
                j.ApplicationDeadline,
                j.Status
            FROM Job j
            INNER JOIN Company c
                ON j.CompanyID = c.CompanyID
            INNER JOIN Category cat
                ON j.CategoryID = cat.CategoryID
            WHERE
                j.Status = 1
                AND j.ApplicationDeadline >= CAST(GETDATE() AS DATE)
            ORDER BY j.PostedDate DESC
        `);

        res.status(200).json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error("Get active jobs error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve active jobs"
        });
    }
};


// ==========================================
// FILTER JOBS BY LOCATION
// ==========================================

const filterJobsByLocation = async (req, res) => {
    try {
        const { location } = req.query;

        if (!location) {
            return res.status(400).json({
                success: false,
                message: "Location is required"
            });
        }

        const pool = await connectDB();

        const result = await pool
            .request()
            .input(
                "Location",
                sql.VarChar,
                `%${location}%`
            )
            .query(`
                SELECT
                    j.JobID,
                    j.CompanyID,
                    c.CompanyName,
                    j.CategoryID,
                    cat.CategoryName,
                    j.JobTitle,
                    j.Description,
                    j.Location,
                    j.JobType,
                    j.PostedDate,
                    j.ApplicationDeadline,
                    j.Status
                FROM Job j
                INNER JOIN Company c
                    ON j.CompanyID = c.CompanyID
                INNER JOIN Category cat
                    ON j.CategoryID = cat.CategoryID
                WHERE j.Location LIKE @Location
                ORDER BY j.PostedDate DESC
            `);

        res.status(200).json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error("Filter jobs by location error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to filter jobs by location"
        });
    }
};


// ==========================================
// FILTER JOBS BY JOB TYPE
// ==========================================

const filterJobsByJobType = async (req, res) => {
    try {
        const { jobType } = req.query;

        if (!jobType) {
            return res.status(400).json({
                success: false,
                message: "Job type is required"
            });
        }

        const pool = await connectDB();

        const result = await pool
            .request()
            .input(
                "JobType",
                sql.VarChar,
                `%${jobType}%`
            )
            .query(`
                SELECT
                    j.JobID,
                    j.CompanyID,
                    c.CompanyName,
                    j.CategoryID,
                    cat.CategoryName,
                    j.JobTitle,
                    j.Description,
                    j.Location,
                    j.JobType,
                    j.PostedDate,
                    j.ApplicationDeadline,
                    j.Status
                FROM Job j
                INNER JOIN Company c
                    ON j.CompanyID = c.CompanyID
                INNER JOIN Category cat
                    ON j.CategoryID = cat.CategoryID
                WHERE j.JobType LIKE @JobType
                ORDER BY j.PostedDate DESC
            `);

        res.status(200).json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error("Filter jobs by job type error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to filter jobs by job type"
        });
    }
};


// ==========================================
// FILTER JOBS BY CATEGORY
// ==========================================

const filterJobsByCategory = async (req, res) => {
    try {
        const categoryId = req.query.categoryId;

        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: "Category ID is required"
            });
        }

        const pool = await connectDB();

        const result = await pool
            .request()
            .input(
                "CategoryID",
                sql.Int,
                categoryId
            )
            .query(`
                SELECT
                    j.JobID,
                    j.CompanyID,
                    c.CompanyName,
                    j.CategoryID,
                    cat.CategoryName,
                    j.JobTitle,
                    j.Description,
                    j.Location,
                    j.JobType,
                    j.PostedDate,
                    j.ApplicationDeadline,
                    j.Status
                FROM Job j
                INNER JOIN Company c
                    ON j.CompanyID = c.CompanyID
                INNER JOIN Category cat
                    ON j.CategoryID = cat.CategoryID
                WHERE j.CategoryID = @CategoryID
                ORDER BY j.PostedDate DESC
            `);

        res.status(200).json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error("Filter jobs by category error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to filter jobs by category"
        });
    }
};


// ==========================================
// FILTER JOBS BY MULTIPLE CRITERIA
// ==========================================

const filterJobs = async (req, res) => {
    try {
        const {
            location,
            jobType,
            categoryId
        } = req.query;

        if (!location && !jobType && !categoryId) {
            return res.status(400).json({
                success: false,
                message: "At least one filter is required"
            });
        }

        const pool = await connectDB();

        let query = `
            SELECT
                j.JobID,
                j.CompanyID,
                c.CompanyName,
                j.CategoryID,
                cat.CategoryName,
                j.JobTitle,
                j.Description,
                j.Location,
                j.JobType,
                j.PostedDate,
                j.ApplicationDeadline,
                j.Status
            FROM Job j
            INNER JOIN Company c
                ON j.CompanyID = c.CompanyID
            INNER JOIN Category cat
                ON j.CategoryID = cat.CategoryID
            WHERE 1 = 1
        `;

        const request = pool.request();

        if (location) {
            query += `
                AND j.Location LIKE @Location
            `;

            request.input(
                "Location",
                sql.VarChar,
                `%${location}%`
            );
        }

        if (jobType) {
            query += `
                AND j.JobType LIKE @JobType
            `;

            request.input(
                "JobType",
                sql.VarChar,
                `%${jobType}%`
            );
        }

        if (categoryId) {
            query += `
                AND j.CategoryID = @CategoryID
            `;

            request.input(
                "CategoryID",
                sql.Int,
                categoryId
            );
        }

        query += `
            ORDER BY j.PostedDate DESC
        `;

        const result = await request.query(query);

        res.status(200).json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error("Filter jobs error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to filter jobs"
        });
    }
};


// ==========================================
// SEARCH JOBS
// ==========================================

const searchJobs = async (req, res) => {
    try {
        const { keyword } = req.query;

        if (!keyword) {
            return res.status(400).json({
                success: false,
                message: "Search keyword is required"
            });
        }

        const pool = await connectDB();

        const result = await pool
            .request()
            .input(
                "Keyword",
                sql.VarChar,
                `%${keyword}%`
            )
            .query(`
                SELECT
                    j.JobID,
                    j.CompanyID,
                    c.CompanyName,
                    j.CategoryID,
                    cat.CategoryName,
                    j.JobTitle,
                    j.Description,
                    j.Location,
                    j.JobType,
                    j.PostedDate,
                    j.ApplicationDeadline,
                    j.Status
                FROM Job j
                INNER JOIN Company c
                    ON j.CompanyID = c.CompanyID
                INNER JOIN Category cat
                    ON j.CategoryID = cat.CategoryID
                WHERE
                    j.JobTitle LIKE @Keyword
                    OR j.Description LIKE @Keyword
                    OR j.Location LIKE @Keyword
                    OR c.CompanyName LIKE @Keyword
                    OR cat.CategoryName LIKE @Keyword
                ORDER BY j.PostedDate DESC
            `);

        res.status(200).json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error("Search jobs error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to search jobs"
        });
    }
};


// ==========================================
// PAGINATE JOBS
// ==========================================

const paginateJobs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        if (page < 1 || pageSize < 1) {
            return res.status(400).json({
                success: false,
                message: "Page and pageSize must be greater than 0"
            });
        }

        const offset = (page - 1) * pageSize;

        const pool = await connectDB();

        const result = await pool
            .request()
            .input("Offset", sql.Int, offset)
            .input("PageSize", sql.Int, pageSize)
            .query(`
                SELECT
                    j.JobID,
                    j.CompanyID,
                    c.CompanyName,
                    j.CategoryID,
                    cat.CategoryName,
                    j.JobTitle,
                    j.Description,
                    j.Location,
                    j.JobType,
                    j.PostedDate,
                    j.ApplicationDeadline,
                    j.Status
                FROM Job j
                INNER JOIN Company c
                    ON j.CompanyID = c.CompanyID
                INNER JOIN Category cat
                    ON j.CategoryID = cat.CategoryID
                ORDER BY j.PostedDate DESC
                OFFSET @Offset ROWS
                FETCH NEXT @PageSize ROWS ONLY
            `);

        res.status(200).json({
            success: true,
            page: page,
            pageSize: pageSize,
            data: result.recordset
        });

    } catch (error) {
        console.error("Paginate jobs error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to paginate jobs"
        });
    }
};


// ==========================================
// GET JOB BY ID
// ==========================================

const getJobById = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await connectDB();

        const result = await pool
            .request()
            .input("JobID", sql.Int, id)
            .query(`
                SELECT
                    j.JobID,
                    j.CompanyID,
                    c.CompanyName,
                    j.CategoryID,
                    cat.CategoryName,
                    j.JobTitle,
                    j.Description,
                    j.Location,
                    j.JobType,
                    j.PostedDate,
                    j.ApplicationDeadline,
                    j.Status
                FROM Job j
                INNER JOIN Company c
                    ON j.CompanyID = c.CompanyID
                INNER JOIN Category cat
                    ON j.CategoryID = cat.CategoryID
                WHERE j.JobID = @JobID
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        res.status(200).json({
            success: true,
            data: result.recordset[0]
        });

    } catch (error) {
        console.error("Get job by ID error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve job"
        });
    }
};


// ==========================================
// CREATE JOB
// ==========================================

const createJob = async (req, res) => {
    try {
        const {
            CompanyID,
            CategoryID,
            JobTitle,
            Description,
            Location,
            JobType,
            ApplicationDeadline,
            Status
        } = req.body;

        if (
            !CompanyID ||
            !CategoryID ||
            !JobTitle ||
            !Description ||
            !Location ||
            !JobType ||
            !ApplicationDeadline ||
            Status === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "All job fields are required"
            });
        }

        const pool = await connectDB();

        await pool
            .request()
            .input("CompanyID", sql.Int, CompanyID)
            .input("CategoryID", sql.Int, CategoryID)
            .input("JobTitle", sql.VarChar, JobTitle)
            .input("Description", sql.VarChar, Description)
            .input("Location", sql.VarChar, Location)
            .input("JobType", sql.VarChar, JobType)
            .input(
                "ApplicationDeadline",
                sql.Date,
                ApplicationDeadline
            )
            .input("Status", sql.Bit, Status)
            .query(`
                INSERT INTO Job
                (
                    CompanyID,
                    CategoryID,
                    JobTitle,
                    Description,
                    Location,
                    JobType,
                    ApplicationDeadline,
                    Status
                )
                VALUES
                (
                    @CompanyID,
                    @CategoryID,
                    @JobTitle,
                    @Description,
                    @Location,
                    @JobType,
                    @ApplicationDeadline,
                    @Status
                )
            `);

        res.status(201).json({
            success: true,
            message: "Job created successfully"
        });

    } catch (error) {
        console.error("Create job error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to create job"
        });
    }
};


// ==========================================
// UPDATE JOB
// ==========================================

const updateJob = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            CategoryID,
            JobTitle,
            Description,
            Location,
            JobType,
            ApplicationDeadline,
            Status
        } = req.body;

        if (
            !CategoryID ||
            !JobTitle ||
            !Description ||
            !Location ||
            !JobType ||
            !ApplicationDeadline ||
            Status === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "All job fields are required"
            });
        }

        const pool = await connectDB();

        const userId = req.user.userId;

        const ownershipCheck = await pool
            .request()
            .input("JobID", sql.Int, id)
            .input("UserID", sql.Int, userId)
            .query(`
                SELECT j.JobID
                FROM Job j
                INNER JOIN Company c
                    ON j.CompanyID = c.CompanyID
                WHERE
                    j.JobID = @JobID
                    AND c.UserID = @UserID
            `);

        if (ownershipCheck.recordset.length === 0) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to update this job"
            });
        }

        await pool
            .request()
            .input("JobID", sql.Int, id)
            .input("CategoryID", sql.Int, CategoryID)
            .input("JobTitle", sql.VarChar, JobTitle)
            .input("Description", sql.VarChar, Description)
            .input("Location", sql.VarChar, Location)
            .input("JobType", sql.VarChar, JobType)
            .input(
                "ApplicationDeadline",
                sql.Date,
                ApplicationDeadline
            )
            .input("Status", sql.Bit, Status)
            .query(`
                UPDATE Job
                SET
                    CategoryID = @CategoryID,
                    JobTitle = @JobTitle,
                    Description = @Description,
                    Location = @Location,
                    JobType = @JobType,
                    ApplicationDeadline = @ApplicationDeadline,
                    Status = @Status
                WHERE JobID = @JobID
            `);

        res.status(200).json({
            success: true,
            message: "Job updated successfully"
        });

    } catch (error) {
        console.error("Update job error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to update job"
        });
    }
};


// ==========================================
// CLOSE JOB
// ==========================================

const closeJob = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await connectDB();

        const userId = req.user.userId;

        const ownershipCheck = await pool
            .request()
            .input("JobID", sql.Int, id)
            .input("UserID", sql.Int, userId)
            .query(`
                SELECT j.JobID
                FROM Job j
                INNER JOIN Company c
                    ON j.CompanyID = c.CompanyID
                WHERE
                    j.JobID = @JobID
                    AND c.UserID = @UserID
            `);

        if (ownershipCheck.recordset.length === 0) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to close this job"
            });
        }

        await pool
            .request()
            .input("JobID", sql.Int, id)
            .query(`
                UPDATE Job
                SET Status = 0
                WHERE JobID = @JobID
            `);

        res.status(200).json({
            success: true,
            message: "Job closed successfully"
        });

    } catch (error) {
        console.error("Close job error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to close job"
        });
    }
};


// ==========================================
// GET EMPLOYER JOBS WITH APPLICATION COUNT
// ==========================================

const getEmployerJobs = async (req, res) => {
    try {
        const userId = req.user.userId;

        const pool = await connectDB();

        const result = await pool
            .request()
            .input("UserID", sql.Int, userId)
            .query(`
                SELECT
                    j.JobID,
                    j.JobTitle,
                    COUNT(a.ApplicationID) AS applicationCount
                FROM Job j
                INNER JOIN Company c
                    ON j.CompanyID = c.CompanyID
                LEFT JOIN Application a
                    ON j.JobID = a.JobID
                WHERE c.UserID = @UserID
                GROUP BY
                    j.JobID,
                    j.JobTitle,
                    j.PostedDate
                ORDER BY j.PostedDate DESC
            `);

        res.status(200).json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error("Get employer jobs error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve employer jobs"
        });
    }
};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
    getAllJobs,
    getActiveJobs,
    filterJobsByLocation,
    filterJobsByJobType,
    filterJobsByCategory,
    filterJobs,
    searchJobs,
    sortJobs,
    paginateJobs,
    getJobById,
    createJob,
    updateJob,
    closeJob,
    getEmployerJobs
};