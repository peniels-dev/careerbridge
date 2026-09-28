const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    getAdminDashboard,
    getAdminUsers,
    updateAdminUserStatus,
    getAdminJobs,
    closeAdminJob,
    getAdminApplications
} = require("../controllers/adminController");

const router = express.Router();

router.get(
    "/dashboard",
    authMiddleware,
    adminMiddleware,
    getAdminDashboard
);

router.get(
    "/users",
    authMiddleware,
    adminMiddleware,
    getAdminUsers
);

router.patch(
    "/users/:id/status",
    authMiddleware,
    adminMiddleware,
    updateAdminUserStatus
);

router.get(
    "/jobs",
    authMiddleware,
    adminMiddleware,
    getAdminJobs
);

router.get(
    "/applications",
    authMiddleware,
    adminMiddleware,
    getAdminApplications
);

router.patch(
    "/jobs/:id/close",
    authMiddleware,
    adminMiddleware,
    closeAdminJob
);

module.exports = router;