
// =====================================================
// VALIDATE :id
// =====================================================

const validateId = (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID. ID must be a positive integer."
        });
    }

    next();
};


// =====================================================
// VALIDATE :jobId
// =====================================================

const validateJobId = (req, res, next) => {
    const jobId = Number(req.params.jobId);

    if (!Number.isInteger(jobId) || jobId <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid Job ID. Job ID must be a positive integer."
        });
    }

    next();
};


// =====================================================
// REGISTRATION VALIDATION
// =====================================================

const validateRegistration = (req, res, next) => {

    const {
        firstName,
        lastName,
        email,
        password,
        role,
        companyId,
        newCompany
    } = req.body;

    const errors = [];


    // =====================================================
    // BASIC USER VALIDATION
    // =====================================================

    if (!firstName || !String(firstName).trim()) {
        errors.push({
            field: "firstName",
            message: "First name is required."
        });
    }

    if (!lastName || !String(lastName).trim()) {
        errors.push({
            field: "lastName",
            message: "Last name is required."
        });
    }


    // =====================================================
    // EMAIL
    // =====================================================

    if (!email || !String(email).trim()) {
        errors.push({
            field: "email",
            message: "Email is required."
        });
    } else {

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(String(email).trim())) {
            errors.push({
                field: "email",
                message: "Please provide a valid email address."
            });
        }
    }


    // =====================================================
    // PASSWORD
    // =====================================================

    if (!password || typeof password !== "string") {

        errors.push({
            field: "password",
            message: "Password is required."
        });

    } else {

        if (password.length < 8) {
            errors.push({
                field: "password",
                message: "Password must be at least 8 characters."
            });
        }

        if (password.length > 20) {
            errors.push({
                field: "password",
                message: "Password must not exceed 20 characters."
            });
        }

        if (!/[A-Z]/.test(password)) {
            errors.push({
                field: "password",
                message:
                    "Password must contain at least one uppercase letter."
            });
        }

        if (!/[a-z]/.test(password)) {
            errors.push({
                field: "password",
                message:
                    "Password must contain at least one lowercase letter."
            });
        }

        if (!/[0-9]/.test(password)) {
            errors.push({
                field: "password",
                message:
                    "Password must contain at least one number."
            });
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push({
                field: "password",
                message:
                    "Password must contain at least one special character."
            });
        }
    }


    // =====================================================
    // ROLE VALIDATION
    // =====================================================

    const allowedRoles = [
        "JobSeeker",
        "Employer"
    ];

    if (!role || !allowedRoles.includes(role)) {

        errors.push({
            field: "role",
            message:
                "Role must be JobSeeker or Employer."
        });
    }


    // =====================================================
    // EMPLOYER VALIDATION
    // =====================================================

    if (role === "Employer") {

        // -------------------------------------------------
        // Determine company selection
        // -------------------------------------------------

        const hasExistingCompany =
            companyId !== undefined &&
            companyId !== null &&
            companyId !== "";

        const hasNewCompany =
            newCompany !== undefined &&
            newCompany !== null &&
            typeof newCompany === "object";


        // -------------------------------------------------
        // Employer must select a company option
        // -------------------------------------------------

        if (!hasExistingCompany && !hasNewCompany) {

            errors.push({
                field: "company",
                message:
                    "Please select an existing company or choose 'My company isn't listed'."
            });
        }


        // -------------------------------------------------
        // Employer cannot select both
        // -------------------------------------------------

        if (hasExistingCompany && hasNewCompany) {

            errors.push({
                field: "company",
                message:
                    "Please select either an existing company or a new company, not both."
            });
        }


        // -------------------------------------------------
        // EXISTING COMPANY
        // -------------------------------------------------

        if (hasExistingCompany) {

            const companyIdNumber = Number(companyId);

            if (
                !Number.isInteger(companyIdNumber) ||
                companyIdNumber <= 0
            ) {

                errors.push({
                    field: "companyId",
                    message:
                        "Please select a valid company."
                });
            }
        }


        // -------------------------------------------------
        // NEW COMPANY
        // -------------------------------------------------

        if (hasNewCompany) {

            // Company name
            if (
                !newCompany.companyName ||
                !String(newCompany.companyName).trim()
            ) {

                errors.push({
                    field: "companyName",
                    message:
                        "Company name is required."
                });
            }


            // Company email
            if (
                !newCompany.companyEmail ||
                !String(newCompany.companyEmail).trim()
            ) {

                errors.push({
                    field: "companyEmail",
                    message:
                        "Company email is required."
                });

            } else {

                const companyEmailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (
                    !companyEmailPattern.test(
                        String(newCompany.companyEmail).trim()
                    )
                ) {

                    errors.push({
                        field: "companyEmail",
                        message:
                            "Please provide a valid company email address."
                    });
                }
            }


            // Company phone
            if (
                !newCompany.companyPhone ||
                !String(newCompany.companyPhone).trim()
            ) {

                errors.push({
                    field: "companyPhone",
                    message:
                        "Company phone number is required."
                });
            }


            // Company address
            if (
                !newCompany.companyAddress ||
                !String(newCompany.companyAddress).trim()
            ) {

                errors.push({
                    field: "companyAddress",
                    message:
                        "Company address is required."
                });
            }


            // Company description
            if (
                !newCompany.companyDescription ||
                !String(newCompany.companyDescription).trim()
            ) {

                errors.push({
                    field: "companyDescription",
                    message:
                        "Company description is required."
                });
            }


            // -------------------------------------------------
            // Company website - OPTIONAL
            // -------------------------------------------------

            if (
                newCompany.companyWebsite !== undefined &&
                newCompany.companyWebsite !== null &&
                String(newCompany.companyWebsite).trim() !== ""
            ) {

                const website =
                    String(newCompany.companyWebsite).trim();

                const websitePattern =
                    /^https?:\/\/.+/i;

                if (!websitePattern.test(website)) {

                    errors.push({
                        field: "companyWebsite",
                        message:
                            "Company website must start with http:// or https://."
                    });
                }
            }
        }
    }


    // =====================================================
    // RETURN REGISTRATION VALIDATION ERRORS
    // =====================================================

    if (errors.length > 0) {

        return res.status(400).json({
            success: false,
            message:
                "Please correct the validation errors.",
            errors
        });
    }

    next();
};


// =====================================================
// JOB VALIDATION
// =====================================================

const validateJob = (req, res, next) => {

    // Support both frontend naming styles

    const JobTitle =
        req.body.JobTitle ??
        req.body.jobTitle;

    const Description =
        req.body.Description ??
        req.body.description;

    const Location =
        req.body.Location ??
        req.body.location;

    const JobType =
        req.body.JobType ??
        req.body.jobType;

    const CategoryID =
        req.body.CategoryID ??
        req.body.categoryId;

    const ApplicationDeadline =
        req.body.ApplicationDeadline ??
        req.body.applicationDeadline;

    const errors = [];


    // =====================================================
    // JOB TITLE
    // =====================================================

    if (
        JobTitle === undefined ||
        JobTitle === null ||
        String(JobTitle).trim() === ""
    ) {

        errors.push({
            field: "JobTitle",
            message:
                "Job title is required."
        });
    }


    // =====================================================
    // DESCRIPTION
    // =====================================================

    if (
        Description === undefined ||
        Description === null ||
        String(Description).trim() === ""
    ) {

        errors.push({
            field: "Description",
            message:
                "Job description is required."
        });
    }


    // =====================================================
    // LOCATION
    // =====================================================

    if (
        Location === undefined ||
        Location === null ||
        String(Location).trim() === ""
    ) {

        errors.push({
            field: "Location",
            message:
                "Job location is required."
        });
    }


    // =====================================================
    // JOB TYPE
    // =====================================================

    const allowedJobTypes = [
        "Full-time",
        "Part-time",
        "Contract",
        "Internship",
        "Temporary",
        "Remote"
    ];

    if (
        JobType === undefined ||
        JobType === null ||
        String(JobType).trim() === ""
    ) {

        errors.push({
            field: "JobType",
            message:
                "Job type is required."
        });

    } else if (
        !allowedJobTypes.includes(
            String(JobType).trim()
        )
    ) {

        errors.push({
            field: "JobType",
            message:
                "Please provide a valid job type."
        });
    }


    // =====================================================
    // CATEGORY ID
    // =====================================================

    const categoryIdNumber =
        Number(CategoryID);

    if (
        CategoryID === undefined ||
        CategoryID === null ||
        CategoryID === "" ||
        !Number.isInteger(categoryIdNumber) ||
        categoryIdNumber <= 0
    ) {

        errors.push({
            field: "CategoryID",
            message:
                "Category ID must be a positive integer."
        });
    }


    // =====================================================
    // APPLICATION DEADLINE
    // =====================================================

    if (
        ApplicationDeadline === undefined ||
        ApplicationDeadline === null ||
        String(ApplicationDeadline).trim() === ""
    ) {

        errors.push({
            field: "ApplicationDeadline",
            message:
                "Application deadline is required."
        });

    } else {

        const deadline =
            new Date(ApplicationDeadline);

        if (Number.isNaN(deadline.getTime())) {

            errors.push({
                field: "ApplicationDeadline",
                message:
                    "Application deadline must be a valid date."
            });

        } else {

            const today = new Date();

            today.setHours(
                0,
                0,
                0,
                0
            );

            deadline.setHours(
                0,
                0,
                0,
                0
            );

            if (deadline < today) {

                errors.push({
                    field: "ApplicationDeadline",
                    message:
                        "Application deadline cannot be in the past."
                });
            }
        }
    }


    // =====================================================
    // RETURN JOB ERRORS
    // =====================================================

    if (errors.length > 0) {

        return res.status(400).json({
            success: false,
            message:
                "Please correct the job validation errors.",
            errors
        });
    }

    next();
};


// =====================================================
// APPLICATION VALIDATION
// =====================================================

const validateApplication = (
    req,
    res,
    next
) => {

    const {
        CVID,
        CoverLetter
    } = req.body;

    const errors = [];


    // =====================================================
    // CV ID
    // =====================================================

    const cvIdNumber =
        Number(CVID);

    if (
        CVID === undefined ||
        CVID === null ||
        CVID === "" ||
        !Number.isInteger(cvIdNumber) ||
        cvIdNumber <= 0
    ) {

        errors.push({
            field: "CVID",
            message:
                "A valid CV ID is required."
        });
    }


    // =====================================================
    // COVER LETTER
    // =====================================================

    // Cover letter is optional

    if (
        CoverLetter !== undefined &&
        CoverLetter !== null &&
        typeof CoverLetter !== "string"
    ) {

        errors.push({
            field: "CoverLetter",
            message:
                "Cover letter must be text."
        });
    }


    // =====================================================
    // RETURN APPLICATION ERRORS
    // =====================================================

    if (errors.length > 0) {

        return res.status(400).json({
            success: false,
            message:
                "Please correct the application validation errors.",
            errors
        });
    }

    next();
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
    validateId,
    validateJobId,
    validateRegistration,
    validateJob,
    validateApplication
};

