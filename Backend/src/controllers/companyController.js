const { connectDB } = require("../config/database");

// =====================================================
// GET LOGGED-IN EMPLOYER'S COMPANY
// =====================================================

const getMyCompany = async (req, res) => {
    try {
        const pool = await connectDB();

        const result = await pool
            .request()
            .input("UserID", req.user.userId)
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
                WHERE UserID = @UserID
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Company profile not found."
            });
        }

        res.json({
            success: true,
            data: result.recordset[0]
        });

    } catch (error) {
        console.error("Get my company error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve company profile."
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

        // Validate email
        if (!Email || !Email.trim()) {
            return res.status(400).json({
                success: false,
                message: "Company email is required."
            });
        }

        const pool = await connectDB();

        // Find the company belonging to the logged-in employer
        const companyResult = await pool
            .request()
            .input("UserID", req.user.userId)
            .query(`
                SELECT CompanyID
                FROM Company
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
                Phone ? Phone.trim() : null
            )
            .input(
                "Address",
                Address ? Address.trim() : null
            )
            .input(
                "Description",
                Description ? Description.trim() : null
            )
            .input(
                "CompanyWebsite",
                CompanyWebsite
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

        res.json({
            success: true,
            message: "Company profile updated successfully.",
            data: updatedCompany.recordset[0]
        });

    } catch (error) {
        console.error("Update company error:", error);

        res.status(500).json({
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

        const pool = await connectDB();

        // Find the company belonging to the logged-in employer
        const companyResult = await pool
            .request()
            .input("UserID", req.user.userId)
            .query(`
                SELECT CompanyID
                FROM Company
                WHERE UserID = @UserID
            `);

        if (companyResult.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Company profile not found."
            });
        }

        const companyID =
            companyResult.recordset[0].CompanyID;

        // File path saved in the database
        const logoPath =
            `/uploads/company-logos/${req.file.filename}`;

        // Update only this employer's company
        await pool
            .request()
            .input("CompanyID", companyID)
            .input("CompanyLogo", logoPath)
            .query(`
                UPDATE Company
                SET CompanyLogo = @CompanyLogo
                WHERE CompanyID = @CompanyID
            `);

        // Get updated company information
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

        res.status(200).json({
            success: true,
            message: "Company logo uploaded successfully.",
            data: updatedCompany.recordset[0]
        });

    } catch (error) {
        console.error(
            "Upload company logo error:",
            error
        );

        res.status(500).json({
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
    getCompanyById,
    updateMyCompany,
    uploadCompanyLogo
};