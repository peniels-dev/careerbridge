const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        // 1. Get the Authorization header
        const authHeader = req.headers.authorization;

        // 2. Check if Authorization header exists
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is required"
            });
        }

        // 3. Check if the header uses Bearer format
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format"
            });
        }

        // 4. Extract the token
        const token = authHeader.split(" ")[1];

        // 5. Verify the JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // 6. Attach decoded user information to the request
        req.user = decoded;

        // 7. Continue to the protected route
        next();

    } catch (error) {
        // Token is invalid or expired
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;