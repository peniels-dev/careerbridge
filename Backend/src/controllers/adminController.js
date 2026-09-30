const { connectDB } = require("../config/database");

const getAdminDashboard = async (req, res) => {
    try {
        const pool = await connectDB();

        const result = await pool
            .request()
            .execute("dbo.uspAdminDashboardSelect");

        return res.status(200).json({
            success: true,
            data: {
                stats: result.recordsets[0][0],
                recentUsers: result.recordsets[1],
                recentJobs: result.recordsets[2]
            }
        });

    } catch (error) {
        console.error("Admin dashboard error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load admin dashboard",
            error: error.message
        });
    }
};


const updateEmployerApproval = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const { decision, adminNote } = req.body;

        if (!Number.isInteger(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid employer ID"
            });
        }

        if (!["Approved", "Rejected"].includes(decision)) {
            return res.status(400).json({
                success: false,
                message: "Decision must be Approved or Rejected"
            });
        }

        const pool = await connectDB();

        const result = await pool
            .request()
            .input("UserID", userId)
            .input("Decision", decision)
            .input("AdminNote", adminNote || null)
            .input("ReviewedByUserID", req.user.userId)
            .execute("dbo.uspAdminEmployerApproval");

        const response = result.recordset[0];

        if (!response || !response.Success) {
            return res.status(400).json({
                success: false,
                message:
                    response?.Message ||
                    "Failed to update employer approval"
            });
        }

        return res.status(200).json({
            success: true,
            message: response.Message
        });

    } catch (error) {
        console.error("Employer approval error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update employer approval",
            error: error.message
        });
    }
};


const getAdminUsers = async (req, res) => {
    try {
        const pool = await connectDB();

        const result = await pool
            .request()
            .execute("dbo.uspAdminUserSelect");

        return res.status(200).json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error("Admin users error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load users",
            error: error.message
        });
    }
};


const updateAdminUserStatus = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const { isActive } = req.body;

        if (!Number.isInteger(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isActive must be true or false"
            });
        }

        const pool = await connectDB();

        const result = await pool
            .request()
            .input("UserID", userId)
            .input("IsActive", isActive)
            .execute("dbo.uspAdminUserStatusUpdate");

        const response = result.recordset[0];

        if (!response || !response.Success) {
            return res.status(404).json({
                success: false,
                message: response?.Message || "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: response.Message
        });

    } catch (error) {
        console.error("Admin user status update error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update user status",
            error: error.message
        });
    }
};


const getAdminJobs = async (req, res) => {
    try {
        const pool = await connectDB();

        const result = await pool
            .request()
            .execute("dbo.uspAdminJobSelect");

        return res.status(200).json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error("Admin jobs error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load jobs",
            error: error.message
        });
    }
};


const closeAdminJob = async (req, res) => {
    try {
        const jobId = Number(req.params.id);

        if (!Number.isInteger(jobId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid job ID"
            });
        }

        const pool = await connectDB();

        const result = await pool
            .request()
            .input("JobID", jobId)
            .execute("dbo.uspAdminJobClose");

        const response = result.recordset[0];

        if (!response || !response.Success) {
            return res.status(404).json({
                success: false,
                message: response?.Message || "Job not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: response.Message
        });

    } catch (error) {
        console.error("Admin job close error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to close job",
            error: error.message
        });
    }
};


const getAdminApplications = async (req, res) => {
    try {
        const pool = await connectDB();

        const result = await pool
            .request()
            .execute("dbo.uspAdminApplicationSelect");

        return res.status(200).json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error("Admin applications error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load applications",
            error: error.message
        });
    }
};


module.exports = {
    getAdminDashboard,
    getAdminUsers,
    updateAdminUserStatus,
    updateEmployerApproval,
    getAdminJobs,
    closeAdminJob,
    getAdminApplications
};