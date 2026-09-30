const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sql, connectDB } = require("../config/database");

// =====================================================
// REGISTER
// =====================================================

const register = async (req, res) => {
    try {
        const {
            firstName,
            middleName,
            lastName,
            email,
            phone,
            password,
            role,
            companyId,
            newCompany
        } = req.body;

        // =====================================================
        // BASIC VALIDATION
        // =====================================================

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
                    "First name, last name, email, phone, password and role are required."
            });
        }

        // Only JobSeeker and Employer can register publicly
        const allowedRoles = ["JobSeeker", "Employer"];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid account type."
            });
        }

        // =====================================================
        // EMPLOYER VALIDATION
        // =====================================================

        let selectingExistingCompany = false;
        let requestingNewCompany = false;

        if (role === "Employer") {
            selectingExistingCompany =
                companyId !== undefined &&
                companyId !== null &&
                companyId !== "" &&
                Number.isInteger(Number(companyId)) &&
                Number(companyId) > 0;

            requestingNewCompany =
                newCompany !== undefined &&
                newCompany !== null &&
                typeof newCompany === "object";

            // Employer must choose an existing company
            // OR submit a new company
            if (
                !selectingExistingCompany &&
                !requestingNewCompany
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Please select your company or choose 'My company isn't listed'."
                });
            }

            // An employer cannot submit both
            // an existing company and a new company.
            if (
                selectingExistingCompany &&
                requestingNewCompany
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Please select either an existing company or a new company, not both."
                });
            }

            // =================================================
            // NEW COMPANY VALIDATION
            // =================================================

            if (requestingNewCompany) {
                if (
                    !newCompany.companyName ||
                    !String(newCompany.companyName).trim()
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Company name is required."
                    });
                }

                if (
                    !newCompany.companyEmail ||
                    !String(newCompany.companyEmail).trim()
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Company email is required."
                    });
                }

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (
                    !emailPattern.test(
                        String(newCompany.companyEmail).trim()
                    )
                ) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Please provide a valid company email address."
                    });
                }

                if (
                    !newCompany.companyPhone ||
                    !String(newCompany.companyPhone).trim()
                ) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Company phone number is required."
                    });
                }

                if (
                    !newCompany.companyAddress ||
                    !String(newCompany.companyAddress).trim()
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Company address is required."
                    });
                }

                if (
                    !newCompany.companyDescription ||
                    !String(
                        newCompany.companyDescription
                    ).trim()
                ) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Company description is required."
                    });
                }
            }
        }

        // =====================================================
        // CONNECT TO DATABASE
        // =====================================================

        const pool = await connectDB();

        // =====================================================
        // CHECK EMAIL
        // =====================================================

        const existingUser = await pool
            .request()
            .input(
                "Email",
                sql.NVarChar,
                email.trim()
            )
            .query(`
                SELECT UserID
                FROM [User]
                WHERE Email = @Email
            `);

        if (existingUser.recordset.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already exists."
            });
        }

        // =====================================================
        // CHECK EXISTING COMPANY
        // =====================================================

        let selectedCompanyID = null;

        if (
            role === "Employer" &&
            selectingExistingCompany
        ) {
            const companyIDNumber = Number(companyId);

            if (
                !Number.isInteger(companyIDNumber) ||
                companyIDNumber <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid company selection."
                });
            }

            const companyResult = await pool
                .request()
                .input(
                    "CompanyID",
                    sql.Int,
                    companyIDNumber
                )
                .query(`
                    SELECT
                        CompanyID,
                        CompanyName
                    FROM Company
                    WHERE CompanyID = @CompanyID
                      AND Status = 1
                `);

            if (companyResult.recordset.length === 0) {
                return res.status(400).json({
                    success: false,
                    message:
                        "The selected company does not exist or is inactive."
                });
            }

            selectedCompanyID = companyIDNumber;
        }

        // =====================================================
        // HASH PASSWORD
        // =====================================================

        const passwordHash = await bcrypt.hash(
            password,
            10
        );

        // =====================================================
        // ACCOUNT STATUS
        // =====================================================

        // JobSeekers are active immediately.
        //
        // Employers must wait for administrator approval.

        const isActive =
            role === "Employer" ? 0 : 1;

        // =====================================================
        // INSERT USER
        // =====================================================

        const userResult = await pool
            .request()
            .input(
                "FirstName",
                sql.NVarChar,
                firstName.trim()
            )
            .input(
                "MiddleName",
                sql.NVarChar,
                middleName
                    ? middleName.trim()
                    : null
            )
            .input(
                "LastName",
                sql.NVarChar,
                lastName.trim()
            )
            .input(
                "Email",
                sql.NVarChar,
                email.trim()
            )
            .input(
                "Phone",
                sql.NVarChar,
                phone.trim()
            )
            .input(
                "Password",
                sql.NVarChar,
                passwordHash
            )
            .input(
                "Role",
                sql.NVarChar,
                role
            )
            .input(
                "IsActive",
                sql.Bit,
                isActive
            )
            .query(`
                INSERT INTO [User]
                (
                    FirstName,
                    MiddleName,
                    LastName,
                    Email,
                    Phone,
                    [Password],
                    Role,
                    IsActive
                )
                OUTPUT INSERTED.UserID
                VALUES
                (
                    @FirstName,
                    @MiddleName,
                    @LastName,
                    @Email,
                    @Phone,
                    @Password,
                    @Role,
                    @IsActive
                )
            `);

        const newUserID =
            userResult.recordset[0].UserID;

        // =====================================================
        // CREATE JOB SEEKER PROFILE
        // =====================================================

        if (role === "JobSeeker") {
            await pool
                .request()
                .input(
                    "UserID",
                    sql.Int,
                    newUserID
                )
                .input(
                    "Phone",
                    sql.NVarChar,
                    phone.trim()
                )
                .query(`
                    INSERT INTO JobSeeker
                    (
                        UserID,
                        Phone
                    )
                    VALUES
                    (
                        @UserID,
                        @Phone
                    )
                `);
        }

        // =====================================================
        // CREATE EMPLOYER REGISTRATION REQUEST
        // =====================================================

        if (role === "Employer") {
            await pool
                .request()
                .input(
                    "UserID",
                    sql.Int,
                    newUserID
                )
                .input(
                    "CompanyID",
                    sql.Int,
                    selectedCompanyID
                )
                .input(
                    "CompanyName",
                    sql.NVarChar,
                    requestingNewCompany
                        ? newCompany.companyName.trim()
                        : null
                )
                .input(
                    "CompanyEmail",
                    sql.NVarChar,
                    requestingNewCompany
                        ? newCompany.companyEmail.trim()
                        : null
                )
                .input(
                    "CompanyPhone",
                    sql.NVarChar,
                    requestingNewCompany
                        ? newCompany.companyPhone.trim()
                        : null
                )
                .input(
                    "CompanyAddress",
                    sql.NVarChar,
                    requestingNewCompany
                        ? newCompany.companyAddress.trim()
                        : null
                )
                .input(
                    "CompanyDescription",
                    sql.NVarChar,
                    requestingNewCompany
                        ? newCompany.companyDescription.trim()
                        : null
                )
                .input(
                    "CompanyWebsite",
                    sql.NVarChar,
                    requestingNewCompany &&
                    newCompany.companyWebsite
                        ? newCompany.companyWebsite.trim()
                        : null
                )
                .query(`
                    INSERT INTO EmployerRegistrationRequest
                    (
                        UserID,
                        CompanyID,
                        CompanyName,
                        CompanyEmail,
                        CompanyPhone,
                        CompanyAddress,
                        CompanyDescription,
                        CompanyWebsite,
                        Status
                    )
                    VALUES
                    (
                        @UserID,
                        @CompanyID,
                        @CompanyName,
                        @CompanyEmail,
                        @CompanyPhone,
                        @CompanyAddress,
                        @CompanyDescription,
                        @CompanyWebsite,
                        'Pending'
                    )
                `);

            return res.status(201).json({
                success: true,
                message:
                    "Employer registration submitted successfully. Your account is pending administrator approval."
            });
        }

        // =====================================================
        // JOB SEEKER RESPONSE
        // =====================================================

        return res.status(201).json({
            success: true,
            message: "Registration successful."
        });

    } catch (error) {
        console.error(
            "Registration error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to complete registration. Please try again later."
        });
    }
};


// =====================================================
// LOGIN
// =====================================================

const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // =====================================================
        // REQUIRED FIELDS
        // =====================================================

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required."
            });
        }

        // =====================================================
        // CONNECT TO DATABASE
        // =====================================================

        const pool = await connectDB();

        // =====================================================
        // FIND USER
        // =====================================================

        const result = await pool
            .request()
            .input(
                "Email",
                sql.NVarChar,
                email.trim()
            )
            .query(`
                SELECT
                    UserID,
                    FirstName,
                    MiddleName,
                    LastName,
                    Email,
                    Phone,
                    [Password],
                    Role,
                    IsActive
                FROM [User]
                WHERE Email = @Email
            `);

        // =====================================================
        // USER NOT FOUND
        // =====================================================

        if (result.recordset.length === 0) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password."
            });
        }

        const user = result.recordset[0];

        // =====================================================
        // CHECK PASSWORD
        // =====================================================

        const passwordMatch = await bcrypt.compare(
            password,
            user.Password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password."
            });
        }

        // =====================================================
        // CHECK INACTIVE ACCOUNT
        // =====================================================

        if (!user.IsActive) {

            // =================================================
            // EMPLOYER ACCOUNT
            // =================================================

            if (user.Role === "Employer") {

                const requestResult = await pool
                    .request()
                    .input(
                        "UserID",
                        sql.Int,
                        user.UserID
                    )
                    .query(`
                        SELECT TOP 1
                            RequestID,
                            Status,
                            AdminNote,
                            CreatedAt,
                            ReviewedAt
                        FROM EmployerRegistrationRequest
                        WHERE UserID = @UserID
                        ORDER BY CreatedAt DESC
                    `);

                // =============================================
                // EMPLOYER REQUEST FOUND
                // =============================================

                if (
                    requestResult.recordset.length >
                    0
                ) {
                    const registrationRequest =
                        requestResult.recordset[0];

                    // =========================================
                    // PENDING
                    // =========================================

                    if (
                        registrationRequest.Status ===
                        "Pending"
                    ) {
                        return res.status(403).json({
                            success: false,
                            code: "EMPLOYER_PENDING",
                            message:
                                "Your employer registration is still pending administrator approval."
                        });
                    }

                    // =========================================
                    // REJECTED
                    // =========================================

                    if (
                        registrationRequest.Status ===
                        "Rejected"
                    ) {
                        const rejectionReason =
                            registrationRequest.AdminNote
                                ? ` Reason: ${registrationRequest.AdminNote}`
                                : "";

                        return res.status(403).json({
                            success: false,
                            code: "EMPLOYER_REJECTED",
                            message:
                                `Your employer registration was rejected.${rejectionReason}`
                        });
                    }
                }

                // =============================================
                // OTHER INACTIVE EMPLOYER
                // =============================================

                return res.status(403).json({
                    success: false,
                    code: "EMPLOYER_INACTIVE",
                    message:
                        "Your employer account is not active. Please contact the administrator."
                });
            }

            // =================================================
            // OTHER INACTIVE ACCOUNTS
            // =================================================

            return res.status(403).json({
                success: false,
                message:
                    "Your account has been disabled. Please contact the administrator."
            });
        }

        // =====================================================
        // GENERATE JWT
        // =====================================================

        const token = jwt.sign(
            {
                userId: user.UserID,
                role: user.Role
            },
            process.env.JWT_SECRET,
            {
                expiresIn:
                    process.env.JWT_EXPIRES_IN
            }
        );

        // =====================================================
        // SUCCESSFUL LOGIN
        // =====================================================

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            data: {
                user: {
                    userId: user.UserID,
                    firstName: user.FirstName,
                    middleName: user.MiddleName,
                    lastName: user.LastName,
                    email: user.Email,
                    phone: user.Phone,
                    role: user.Role,
                    isActive: user.IsActive
                },
                token
            }
        });

    } catch (error) {
        console.error(
            "Login error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to complete login. Please try again later."
        });
    }
};


// =====================================================
// VERIFY PASSWORD RESET
// =====================================================

const verifyPasswordReset = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone
        } = req.body;

        // =====================================================
        // REQUIRED FIELDS
        // =====================================================

        if (
            !firstName ||
            !lastName ||
            !email ||
            !phone
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "First name, last name, email and phone number are required."
            });
        }

        const pool = await connectDB();

        // =====================================================
        // FIND ACCOUNT
        // =====================================================

        const result = await pool
            .request()
            .input(
                "FirstName",
                sql.NVarChar,
                firstName.trim()
            )
            .input(
                "LastName",
                sql.NVarChar,
                lastName.trim()
            )
            .input(
                "Email",
                sql.NVarChar,
                email.trim()
            )
            .input(
                "Phone",
                sql.NVarChar,
                phone.trim()
            )
            .query(`
                SELECT
                    UserID,
                    FirstName,
                    LastName,
                    Email,
                    Phone,
                    Role,
                    IsActive
                FROM [User]
                WHERE
                    FirstName = @FirstName
                    AND LastName = @LastName
                    AND Email = @Email
                    AND Phone = @Phone
            `);

        // =====================================================
        // ACCOUNT NOT FOUND
        // =====================================================

        if (result.recordset.length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "The information provided could not be verified."
            });
        }

        const user = result.recordset[0];

        // =====================================================
        // DISABLED ACCOUNT
        // =====================================================

        if (!user.IsActive) {
            return res.status(403).json({
                success: false,
                message:
                    "This account has been disabled. Please contact the administrator."
            });
        }

        // =====================================================
        // CREATE RESET TOKEN
        // =====================================================

        const resetToken = jwt.sign(
            {
                userId: user.UserID,
                purpose: "password-reset"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "10m"
            }
        );

        return res.status(200).json({
            success: true,
            message:
                "Account verified successfully.",
            resetToken
        });

    } catch (error) {
        console.error(
            "Password reset verification error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message
        });
    }
};


// =====================================================
// RESET PASSWORD
// =====================================================

const resetPassword = async (req, res) => {
    try {
        const {
            resetToken,
            password,
            confirmPassword
        } = req.body;

        // =====================================================
        // REQUIRED FIELDS
        // =====================================================

        if (
            !resetToken ||
            !password ||
            !confirmPassword
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Reset token, password and confirm password are required."
            });
        }

        // =====================================================
        // PASSWORD MATCH
        // =====================================================

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message:
                    "Passwords do not match."
            });
        }

        // =====================================================
        // PASSWORD REQUIREMENTS
        // =====================================================

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 8 characters."
            });
        }

        if (password.length > 20) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must not exceed 20 characters."
            });
        }

        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must contain at least one uppercase letter."
            });
        }

        if (!/[a-z]/.test(password)) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must contain at least one lowercase letter."
            });
        }

        if (!/[0-9]/.test(password)) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must contain at least one number."
            });
        }

        if (
            !/[!@#$%^&*(),.?":{}|<>]/.test(
                password
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must contain at least one special character."
            });
        }

        // =====================================================
        // VERIFY RESET TOKEN
        // =====================================================

        let decoded;

        try {
            decoded = jwt.verify(
                resetToken,
                process.env.JWT_SECRET
            );
        } catch (tokenError) {
            return res.status(400).json({
                success: false,
                message:
                    "Password reset session has expired. Please start again."
            });
        }

        // =====================================================
        // VERIFY TOKEN PURPOSE
        // =====================================================

        if (
            decoded.purpose !==
            "password-reset"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid password reset request."
            });
        }

        const pool = await connectDB();

        // =====================================================
        // HASH NEW PASSWORD
        // =====================================================

        const passwordHash =
            await bcrypt.hash(
                password,
                10
            );

        // =====================================================
        // UPDATE PASSWORD
        // =====================================================

        const result = await pool
            .request()
            .input(
                "UserID",
                sql.Int,
                decoded.userId
            )
            .input(
                "Password",
                sql.NVarChar,
                passwordHash
            )
            .query(`
                UPDATE [User]
                SET [Password] = @Password
                WHERE UserID = @UserID
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "User account could not be found."
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Password reset successfully."
        });

    } catch (error) {
        console.error(
            "Password reset error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message
        });
    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    register,
    login,
    verifyPasswordReset,
    resetPassword
};