const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

const allowedExtensions = [
    ".pdf",
    ".doc",
    ".docx"
];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(
            null,
            path.join(__dirname, "../../uploads/cvs")
        );
    },

    filename: (req, file, cb) => {
        const extension = path
            .extname(file.originalname)
            .toLowerCase();

        const uniqueName =
            Date.now() +
            "-" +
            crypto.randomBytes(16).toString("hex") +
            extension;

        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const extension = path
        .extname(file.originalname)
        .toLowerCase();

    if (
        allowedMimeTypes.includes(file.mimetype) &&
        allowedExtensions.includes(extension)
    ) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Unsupported file type. Please upload a PDF, DOC, or DOCX file."
            ),
            false
        );
    }
};

const upload = multer({
    storage: storage,

    fileFilter: fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = upload;