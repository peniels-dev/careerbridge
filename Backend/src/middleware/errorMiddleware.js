const errorHandler = (err, req, res, next) => {
    console.error("API Error:", {
        message: err.message,
        code: err.code,
        number: err.number,
        status: err.status
    });

    // SQL Server business errors
    if (err.number === 50003) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to manage this job."
        });
    }

    if (err.number === 50006) {
        return res.status(400).json({
            success: false,
            message: "This job is closed or the application deadline has expired."
        });
    }

    if (err.number === 50007) {
        return res.status(409).json({
            success: false,
            message: "You have already applied for this job."
        });
    }

    if (err.number === 50008) {
        return res.status(400).json({
            success: false,
            message: "Invalid application status."
        });
    }

    if (err.number === 50009) {
        return res.status(404).json({
            success: false,
            message: "Application not found or you are not authorized to access it."
        });
    }

    if (err.number === 50010) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }

    // Multer: file too large
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            success: false,
            message: "CV file is too large. Maximum file size is 5 MB."
        });
    }

    // Multer: unsupported file type
    if (
        err.message &&
        err.message.includes("Unsupported file type")
    ) {
        return res.status(400).json({
            success: false,
            message: "Unsupported file type. Please upload a PDF, DOC, or DOCX file."
        });
    }

    // Explicit HTTP status set by middleware/controller
    if (err.status) {
        return res.status(err.status).json({
            success: false,
            message: err.message || "Request failed."
        });
    }

    // Unexpected server error
    return res.status(500).json({
        success: false,
        message: "An unexpected server error occurred. Please try again later."
    });
};


const notFoundHandler = (req, res) => {
    return res.status(404).json({
        success: false,
        message: `API endpoint not found: ${req.method} ${req.originalUrl}`
    });
};


module.exports = {
    errorHandler,
    notFoundHandler
};