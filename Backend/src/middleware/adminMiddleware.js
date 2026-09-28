const adminMiddleware = (req, res, next) => {
    console.log("========== ADMIN MIDDLEWARE ==========");

    // authMiddleware must run before this middleware
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    console.log("Authenticated user ID:", req.user.userId);
    console.log("Authenticated user role:", req.user.role);

    // Only Admin can access Admin endpoints
    if (req.user.role !== "Admin") {
        console.log("ADMIN ACCESS DENIED");

        return res.status(403).json({
            success: false,
            message: "Admin access required"
        });
    }

    console.log("ADMIN ACCESS GRANTED");

    next();
};

module.exports = adminMiddleware;