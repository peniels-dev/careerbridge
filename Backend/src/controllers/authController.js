const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sql, connectDB } = require("../config/database");

// =========================
// REGISTER
// =========================

const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            password,
            role,
            companyId
        } = req.body;

        // Check required fields
        if (
            !firstName ||
            !lastName ||
            !email ||
            !phone ||
            !password ||
            !role
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "First name, last name, email, phone, password and role are required"
            });
        }

        // Only JobSeeker and Employer can register publicly
        const allowedRoles = ["JobSeeker", "Employer"];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid account type"
            });
        }

        // Employer must provide a company
        if (role === "Employer" && !companyId) {
            return res.status(400).json({
                success: false,
                message: "Company is required for Employer registration"
            });
        }

        // Connect to database
        const pool = await connectDB();

        // Check if email already exists
        const existingUser = await pool
            .request()
            .input("Email", sql.NVarChar, email)
            .query(`
                SELECT UserID
                FROM [User]
                WHERE Email = @Email
            `);

        if (existingUser.recordset.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        // If registering as Employer,
        // check that the company exists
        if (role === "Employer") {
            const companyResult = await pool
                .request()
                .input("CompanyID", sql.Int, companyId)
                .query(`
                    SELECT CompanyID
                    FROM Company
                    WHERE CompanyID = @CompanyID
                `);

            if (companyResult.recordset.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Selected company does not exist"
                });
            }
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert user
        await pool
            .request()
            .input("FirstName", sql.NVarChar, firstName)
            .input("LastName", sql.NVarChar, lastName)
            .input("Email", sql.NVarChar, email)
            .input("Phone", sql.NVarChar, phone)
            .input("Password", sql.NVarChar, passwordHash)
            .input("Role", sql.NVarChar, role)
            .query(`
                INSERT INTO [User]
                (
                    FirstName,
                    LastName,
                    Email,
                    Phone,
                    [Password],
                    Role
                )
                VALUES
                (
                    @FirstName,
                    @LastName,
                    @Email,
                    @Phone,
                    @Password,
                    @Role
                )
            `);

        // Successful registration
        return res.status(201).json({
            success: true,
            message: "Registration successful"
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =========================
// LOGIN
// =========================

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Connect to database
        const pool = await connectDB();

        // Find user by email
        const result = await pool
            .request()
            .input("Email", sql.NVarChar, email)
            .query(`
                SELECT
                    UserID,
                    FirstName,
                    LastName,
                    Email,
                    Phone,
                    [Password],
                    Role
                FROM [User]
                WHERE Email = @Email
            `);

        // Check if user exists
        if (result.recordset.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Get the user
        const user = result.recordset[0];

        // Compare entered password with stored password hash
        const passwordMatch = await bcrypt.compare(
            password,
            user.Password
        );

        // Check password
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user.UserID,
                role: user.Role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );

        // Successful login
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    userId: user.UserID,
                    firstName: user.FirstName,
                    lastName: user.LastName,
                    email: user.Email,
                    role: user.Role
                },
                token: token
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =========================
// EXPORT
// =========================

module.exports = {
    register,
    login
};