const { connectDB } = require("../config/database");

// =====================================================
// GET LOGGED-IN EMPLOYER'S COMPANY
// =====================================================

// =====================================================
// GET LOGGED-IN EMPLOYER'S COMPANY
// =====================================================

const getMyCompany = async (req, res) => {
    try {
        const userID = req.user.userId;

        const pool = await connectDB();

        const result = await pool
            .request()
            .input("UserID", userID)
            .query(`
                SELECT
                    C.CompanyID,
                    C.CompanyName,
                    C.Email,
                    C.Phone,
                    C.Address,
                    C.Description,
                    C.CompanyWebsite,
                    C.CreatedDate,
                    C.Status,
                    C.CompanyLogo,
                    C.UserID
                FROM Company C
                INNER JOIN CompanyEmployer CE
                    ON CE.CompanyID = C.CompanyID
                WHERE CE.UserID = @UserID
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Company profile not found."
            });
        }

        return res.status(200).json({
            success: true,
            data: result.recordset[0]
        });

    } catch (error) {
        console.error("Get my company error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve company profile."
        });
    }
};


// =====================================================
// CREATE COMPANY FOR LOGGED-IN EMPLOYER
// =====================================================

const createMyCompany = async (req, res) => {
    try {
        const {
            CompanyName,
            Email,
            Phone,
            Address,
            Description,
            CompanyWebsite
        } = req.body;

        // Validate company name
        if (!CompanyName || !CompanyName.trim()) {
            return res.status(400).json({
                success: false,
                message: "Company name is required."
            });
        }

        // Validate email
        if (!Email || !Email.trim()) {
            return res.status(400).json({
                success: false,
                message: "Company email is required."
            });
        }

        const userID = req.user.userId;

        const pool = await connectDB();

        // -------------------------------------------------
        // Check whether this employer already has a company
        // -------------------------------------------------

        const existingLink = await pool
            .request()
            .input("UserID", userID)
            .query(`
                SELECT CompanyID
                FROM CompanyEmployer
                WHERE UserID = @UserID
            `);

        if (existingLink.recordset.length > 0) {
            return res.status(409).json({
                success: false,
                message: "You already have a company profile."
            });
        }

        // -------------------------------------------------
        // Also check Company.UserID
        // -------------------------------------------------

        const existingCompany = await pool
            .request()
            .input("UserID", userID)
            .query(`
                SELECT CompanyID
                FROM Company
                WHERE UserID = @UserID
            `);

        if (existingCompany.recordset.length > 0) {
            return res.status(409).json({
                success: false,
                message: "You already have a company profile."
            });
        }

        // -------------------------------------------------
        // Create the company
        // -------------------------------------------------

        const result = await pool
            .request()
            .input("CompanyName", CompanyName.trim())
            .input("Email", Email.trim())
            .input(
                "Phone",
                Phone && Phone.trim()
                    ? Phone.trim()
                    : null
            )
            .input(
                "Address",
                Address && Address.trim()
                    ? Address.trim()
                    : null
            )
            .input(
                "Description",
                Description && Description.trim()
                    ? Description.trim()
                    : null
            )
            .input(
                "CompanyWebsite",
                CompanyWebsite && CompanyWebsite.trim()
                    ? CompanyWebsite.trim()
                    : null
            )
            .input("UserID", userID)
            .query(`
                INSERT INTO Company
                (
                    CompanyName,
                    Email,
                    Phone,
                    Address,
                    Description,
                    CompanyWebsite,
                    CreatedDate,
                    Status,
                    UserID
                )
                OUTPUT
                    INSERTED.CompanyID,
                    INSERTED.CompanyName,
                    INSERTED.Email,
                    INSERTED.Phone,
                    INSERTED.Address,
                    INSERTED.Description,
                    INSERTED.CompanyWebsite,
                    INSERTED.CreatedDate,
                    INSERTED.Status,
                    INSERTED.CompanyLogo,
                    INSERTED.UserID
                VALUES
                (
                    @CompanyName,
                    @Email,
                    @Phone,
                    @Address,
                    @Description,
                    @CompanyWebsite,
                    GETDATE(),
                    1,
                    @UserID
                )
            `);

        const newCompany = result.recordset[0];

        // -------------------------------------------------
        // Connect employer to the new company
        // -------------------------------------------------

        await pool
            .request()
            .input("UserID", userID)
            .input("CompanyID", newCompany.CompanyID)
            .query(`
                INSERT INTO CompanyEmployer
                (
                    UserID,
                    CompanyID
                )
                VALUES
                (
                    @UserID,
                    @CompanyID
                )
            `);

        // -------------------------------------------------
        // Return the newly created company
        // -------------------------------------------------

        return res.status(201).json({
            success: true,
            message: "Company profile created successfully.",
            data: newCompany
        });

    } catch (error) {
        console.error("Create company error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to create company profile."
        });
    }
};

// =====================================================
// GET COMPANY BY ID
// =====================================================

const getCompanyById = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await connectDB();

        const result = await pool
            .request()
            .input("CompanyID", id)
            .query(`
                SELECT
                    CompanyID,
                    CompanyName,
                    Email,
                    Phone,
                    Address,
                    Description,
                    CompanyWebsite,
                    CreatedDate,
                    Status,
                    CompanyLogo
                FROM Company
                WHERE CompanyID = @CompanyID
                    AND Status = 1
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Company not found."
            });
        }

        res.json({
            success: true,
            data: result.recordset[0]
        });

    } catch (error) {
        console.error("Get company by ID error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve company."
        });
    }
};


// =====================================================
// UPDATE LOGGED-IN EMPLOYER'S COMPANY
// =====================================================

const updateMyCompany = async (req, res) => {
    try {
        const {
            CompanyName,
            Email,
            Phone,
            Address,
            Description,
            CompanyWebsite
        } = req.body;

        // Validate company name
        if (!CompanyName || !CompanyName.trim()) {
            return res.status(400).json({
                success: false,
                message: "Company name is required."
            });
        }

        // Validate company email
        if (!Email || !Email.trim()) {
            return res.status(400).json({
                success: false,
                message: "Company email is required."
            });
        }

        const userID = req.user.userId;

        const pool = await connectDB();

        // Find company through CompanyEmployer
        const companyResult = await pool
            .request()
            .input("UserID", userID)
            .query(`
                SELECT CompanyID
                FROM CompanyEmployer
                WHERE UserID = @UserID
            `);

        if (companyResult.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Company profile not found."
            });
        }

        const companyID = companyResult.recordset[0].CompanyID;

        // Update company
        await pool
            .request()
            .input("CompanyID", companyID)
            .input("CompanyName", CompanyName.trim())
            .input("Email", Email.trim())
            .input(
                "Phone",
                Phone && Phone.trim()
                    ? Phone.trim()
                    : null
            )
            .input(
                "Address",
                Address && Address.trim()
                    ? Address.trim()
                    : null
            )
            .input(
                "Description",
                Description && Description.trim()
                    ? Description.trim()
                    : null
            )
            .input(
                "CompanyWebsite",
                CompanyWebsite && CompanyWebsite.trim()
                    ? CompanyWebsite.trim()
                    : null
            )
            .query(`
                UPDATE Company
                SET
                    CompanyName = @CompanyName,
                    Email = @Email,
                    Phone = @Phone,
                    Address = @Address,
                    Description = @Description,
                    CompanyWebsite = @CompanyWebsite
                WHERE CompanyID = @CompanyID
            `);

        // Get updated company
        const updatedCompany = await pool
            .request()
            .input("CompanyID", companyID)
            .query(`
                SELECT
                    CompanyID,
                    CompanyName,
                    Email,
                    Phone,
                    Address,
                    Description,
                    CompanyWebsite,
                    CreatedDate,
                    Status,
                    CompanyLogo,
                    UserID
                FROM Company
                WHERE CompanyID = @CompanyID
            `);

        return res.status(200).json({
            success: true,
            message: "Company profile updated successfully.",
            data: updatedCompany.recordset[0]
        });

    } catch (error) {
        console.error("Update company error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update company profile."
        });
    }
};
// =====================================================
// UPLOAD / CHANGE COMPANY LOGO
// =====================================================

const uploadCompanyLogo = async (req, res) => {
    try {
        // Check if a file was selected
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Company logo is required."
            });
        }

        const userID = req.user.userId;

        const pool = await connectDB();

        // Find company through CompanyEmployer
        const companyResult = await pool
            .request()
            .input("UserID", userID)
            .query(`
                SELECT CompanyID
                FROM CompanyEmployer
                WHERE UserID = @UserID
            `);

        if (companyResult.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Company profile not found."
            });
        }

        const companyID = companyResult.recordset[0].CompanyID;

        // File path saved in database
        const logoPath =
            `/uploads/company-logos/${req.file.filename}`;

        // Update company logo
        await pool
            .request()
            .input("CompanyID", companyID)
            .input("CompanyLogo", logoPath)
            .query(`
                UPDATE Company
                SET CompanyLogo = @CompanyLogo
                WHERE CompanyID = @CompanyID
            `);

        // Get updated company
        const updatedCompany = await pool
            .request()
            .input("CompanyID", companyID)
            .query(`
                SELECT
                    CompanyID,
                    CompanyName,
                    Email,
                    Phone,
                    Address,
                    Description,
                    CompanyWebsite,
                    CreatedDate,
                    Status,
                    CompanyLogo,
                    UserID
                FROM Company
                WHERE CompanyID = @CompanyID
            `);

        return res.status(200).json({
            success: true,
            message: "Company logo uploaded successfully.",
            data: updatedCompany.recordset[0]
        });

    } catch (error) {
        console.error("Upload company logo error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to upload company logo."
        });
    }
};
// =====================================================
// EXPORT CONTROLLERS
// =====================================================

module.exports = {
    getMyCompany,
    createMyCompany,
    getCompanyById,
    updateMyCompany,
    uploadCompanyLogo
};

