const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    getAdminDashboard,
    getAdminUsers,
    updateAdminUserStatus,
    updateEmployerApproval,
    getAdminJobs,
    getAdminApplications,
    closeAdminJob
} = require("../controllers/adminController");

const router = express.Router();


// =========================
// ADMIN DASHBOARD
// =========================

router.get(
    "/dashboard",
    authMiddleware,
    adminMiddleware,
    getAdminDashboard
);


// =========================
// ADMIN USERS
// =========================

router.get(
    "/users",
    authMiddleware,
    adminMiddleware,
    getAdminUsers
);


// Activate / deactivate normal users

router.patch(
    "/users/:id/status",
    authMiddleware,
    adminMiddleware,
    updateAdminUserStatus
);


// Approve / reject employers

router.patch(
    "/employers/:id/approval",
    authMiddleware,
    adminMiddleware,
    updateEmployerApproval
);


// =========================
// ADMIN JOBS
// =========================

router.get(
    "/jobs",
    authMiddleware,
    adminMiddleware,
    getAdminJobs
);


router.patch(
    "/jobs/:id/close",
    authMiddleware,
    adminMiddleware,
    closeAdminJob
);


// =========================
// ADMIN APPLICATIONS
// =========================

router.get(
    "/applications",
    authMiddleware,
    adminMiddleware,
    getAdminApplications
);


module.exports = router;