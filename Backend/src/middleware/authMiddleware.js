const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    console.log("========== AUTH MIDDLEWARE ==========");
    console.log("Authorization header:", req.headers.authorization);

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            console.log("NO AUTHORIZATION HEADER");

            return res.status(401).json({
                success: false,
                message: "Authorization token is required"
            });
        }

        const token = authHeader.split(" ")[1];

        console.log("Token received:", token ? "YES" : "NO");

        if (!token) {
            console.log("NO TOKEN AFTER BEARER");

            return res.status(401).json({
                success: false,
                message: "Invalid authorization format"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("JWT VERIFIED SUCCESSFULLY");
        console.log("Decoded user:", decoded);

        req.user = decoded;

        next();

    } catch (error) {
        console.error("========== JWT ERROR ==========");
        console.error(error.name);
        console.error(error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;