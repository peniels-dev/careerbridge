-- ================================================================
-- CAREERBRIDGE DAY 4 EXERCISE
-- Student: Larbi Peniels Okyerewa
-- Date: 2026
-- Description: Creating the CareerBridge database from the Day 3
--              ERD, inserting sample data, and running SQL queries.
-- ================================================================


-- ================================================================
-- PART 1: CREATE THE DATABASE
-- ================================================================
CREATE DATABASE CareerBridgeDB;
GO

USE CareerBridgeDB;
GO


-- ================================================================
-- PART 2: CREATE THE TABLES
-- ================================================================

-- ---------- Users ----------
-- Stores everyone who logs in: job seekers, employers, admins
CREATE TABLE Users (
    UserID          INT             IDENTITY(1,1) PRIMARY KEY,
    FirstName       NVARCHAR(50)    NOT NULL,
    LastName        NVARCHAR(50)    NOT NULL,
    Email           NVARCHAR(100)   NOT NULL UNIQUE,
    PasswordHash    NVARCHAR(255)   NOT NULL,
    Role            NVARCHAR(20)    NOT NULL DEFAULT 'JobSeeker',
    Phone           NVARCHAR(20)    NULL,
    CreatedOn       DATETIME        NOT NULL DEFAULT GETDATE(),
    IsActive        BIT             NOT NULL DEFAULT 1
);
GO

-- ---------- Company ----------
-- Companies that post jobs
CREATE TABLE Company (
    CompanyID       INT             IDENTITY(1,1) PRIMARY KEY,
    CompanyName     NVARCHAR(100)   NOT NULL,
    Email           NVARCHAR(100)   NULL,
    Phone           NVARCHAR(20)    NULL,
    Address         NVARCHAR(200)   NULL,
    Description     NVARCHAR(500)   NULL,
    CompanyWebsite  NVARCHAR(200)   NULL
);
GO

-- ---------- JobCategory ----------
-- Categories like Software Development, Data & Analytics
CREATE TABLE JobCategory (
    CategoryID      INT             IDENTITY(1,1) PRIMARY KEY,
    CategoryName    NVARCHAR(50)    NOT NULL UNIQUE,
    Description     NVARCHAR(255)   NULL,
    Status          BIT             NOT NULL DEFAULT 1
);
GO

-- ---------- JobSeeker ----------
-- Extra profile info for users who are job seekers
CREATE TABLE JobSeeker (
    JobSeekerID     INT             IDENTITY(1,1) PRIMARY KEY,
    UserID          INT             NOT NULL UNIQUE,
    Phone           NVARCHAR(20)    NULL,
    Location        NVARCHAR(100)   NULL,
    Skills          NVARCHAR(500)   NULL,
    Education       NVARCHAR(500)   NULL,

    CONSTRAINT FK_JobSeeker_User
        FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
GO

-- ---------- Admin ----------
-- Extra profile info for admin users
CREATE TABLE Admin (
    AdminID         INT             IDENTITY(1,1) PRIMARY KEY,
    UserID          INT             NOT NULL UNIQUE,
    AdminRole       NVARCHAR(50)    NOT NULL DEFAULT 'Moderator',
    CreatedDate     DATETIME        NOT NULL DEFAULT GETDATE(),
    Status          BIT             NOT NULL DEFAULT 1,

    CONSTRAINT FK_Admin_User
        FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
GO

-- ---------- Job ----------
-- Job postings, linked to a company and a category
CREATE TABLE Job (
    JobID               INT             IDENTITY(1,1) PRIMARY KEY,
    CompanyID           INT             NOT NULL,
    CategoryID          INT             NOT NULL,
    JobTitle            NVARCHAR(100)   NOT NULL,
    Description         NVARCHAR(1000)  NULL,
    Location            NVARCHAR(100)   NULL,
    JobType             NVARCHAR(30)    NOT NULL DEFAULT 'Full-Time',
    PostedDate          DATETIME        NOT NULL DEFAULT GETDATE(),
    ApplicationDeadline DATETIME        NULL,
    IsActive            BIT             NOT NULL DEFAULT 1,

    CONSTRAINT FK_Job_Company
        FOREIGN KEY (CompanyID) REFERENCES Company(CompanyID),
    CONSTRAINT FK_Job_Category
        FOREIGN KEY (CategoryID) REFERENCES JobCategory(CategoryID)
);
GO

-- ---------- Application ----------
-- Links a job seeker to a job (resolves many-to-many)
CREATE TABLE Application (
    ApplicationID   INT             IDENTITY(1,1) PRIMARY KEY,
    JobSeekerID     INT             NOT NULL,
    JobID           INT             NOT NULL,
    ApplicationDate DATETIME        NOT NULL DEFAULT GETDATE(),
    Status          NVARCHAR(20)    NOT NULL DEFAULT 'Submitted',
    CoverLetter     NVARCHAR(1000)  NULL,

    CONSTRAINT FK_Application_JobSeeker
        FOREIGN KEY (JobSeekerID) REFERENCES JobSeeker(JobSeekerID),
    CONSTRAINT FK_Application_Job
        FOREIGN KEY (JobID) REFERENCES Job(JobID),

    -- Stop the same seeker applying to the same job twice
    CONSTRAINT UQ_Application_JobSeeker_Job
        UNIQUE (JobSeekerID, JobID)
);
GO

-- ---------- CV ----------
-- CVs uploaded by job seekers
CREATE TABLE CV (
    CVID            INT             IDENTITY(1,1) PRIMARY KEY,
    JobSeekerID     INT             NOT NULL,
    CVTitle         NVARCHAR(100)   NOT NULL,
    FilePath        NVARCHAR(255)   NULL,
    UploadDate      DATETIME        NOT NULL DEFAULT GETDATE(),
    LastUpdated     DATETIME        NULL,

    CONSTRAINT FK_CV_JobSeeker
        FOREIGN KEY (JobSeekerID) REFERENCES JobSeeker(JobSeekerID)
);
GO


-- ================================================================
-- PART 5: INSERT SAMPLE DATA
-- ================================================================

-- ---------- Users (5 users) ----------
-- Mix of job seekers, employers and one admin
INSERT INTO Users (FirstName, LastName, Email, PasswordHash, Role, Phone, CreatedOn)
VALUES
('Larbi',   'Okyerewa', 'larbi.okyerewa@gmail.com',   'a1b2c3d4e5f6', 'JobSeeker', '0244123456', '2026-01-02'),
('Abena',   'Danso',    'abena.danso@gmail.com',      'g7h8i9j0k1l2', 'JobSeeker', '0201987654', '2026-01-03'),
('Kwame',   'Appiah',   'kwame.appiah@techghana.com', 'm3n4o5p6q7r8', 'Employer',  '0302456789', '2026-01-04'),
('Akosua',  'Boateng',  'akosua.b@dataworks.com',     's9t0u1v2w3x4', 'Employer',  '0302987654', '2026-01-05'),
('Nana',    'Adjei',    'nana.adjei@careerbridge.com','y5z6a7b8c9d0', 'Admin',     '0244555666', '2026-01-06');

-- ---------- Company (3 companies) ----------
INSERT INTO Company (CompanyName, Email, Phone, Address, Description, CompanyWebsite)
VALUES
('TechGhana Solutions', 'info@techghana.com',    '0302111222', '12 Independence Ave, Accra',
 'A software development firm building web and mobile apps for African businesses.', 'www.techghana.com'),
('DataWorks Africa',    'careers@dataworks.africa','0302333444','45 Oxford Street, Osu, Accra',
 'A data analytics consultancy helping companies make sense of their data.', 'www.dataworks.africa'),
('NetLink Systems',     'hr@netlinksystems.com', '0322555666', '8 Harper Road, Kumasi',
 'IT infrastructure and networking company based in Kumasi.', 'www.netlinksystems.com');

-- ---------- JobCategory (4 categories) ----------
INSERT INTO JobCategory (CategoryName, Description)
VALUES
('Software Development', 'Jobs related to building and maintaining software'),
('Data & Analytics',     'Data science, business intelligence and analytics roles'),
('Networking',           'Network engineering and IT infrastructure roles'),
('Accounting',           'Finance, auditing and accounting roles');

-- ---------- JobSeeker (5 profiles linked to users 1,2 and 3 more) ----------
-- User 1 (Larbi) and User 2 (Abena) are job seekers.
-- For this exercise, users 3,4,5 also have seeker profiles.
INSERT INTO JobSeeker (UserID, Phone, Location, Skills, Education)
VALUES
(1, '0244123456', 'Accra',  'C#, SQL Server, HTML, CSS',        'BSc Computer Science, University of Ghana'),
(2, '0201987654', 'Accra',  'Python, Excel, Power BI, SQL',     'BSc Statistics, KNUST'),
(3, '0302456789', 'Kumasi', 'Java, Spring Boot, REST APIs',     'BSc Information Technology, KNUST'),
(4, '0302987654', 'Accra',  'Excel, QuickBooks, Financial Reporting', 'BCom Accounting, University of Cape Coast'),
(5, '0244555666', 'Accra',  'SQL, Tableau, Data Modelling',     'MSc Data Science, Ashesi University');

-- ---------- Admin (1 admin linked to user 5) ----------
INSERT INTO Admin (UserID, AdminRole)
VALUES
(5, 'SuperAdmin');

-- ---------- Job (6 jobs) ----------
INSERT INTO Job (CompanyID, CategoryID, JobTitle, Description, Location, JobType, PostedDate, ApplicationDeadline, IsActive)
VALUES
(1, 1, 'Software Developer Intern',
 'Join our team as an intern and work on real client projects using C# and SQL Server.',
 'Accra', 'Internship', '2026-01-08', '2026-03-15', 1),

(2, 2, 'Data Analyst Intern',
 'Assist our analytics team with data cleaning, reporting and dashboard building.',
 'Accra', 'Internship', '2026-01-10', '2026-03-20', 1),

(3, 3, 'Network Engineer',
 'Design, install and maintain network infrastructure for our clients.',
 'Kumasi', 'Full-Time', '2026-01-12', '2026-04-10', 1),

(1, 1, 'Junior Software Developer',
 'Full-time role building and maintaining web applications using .NET and SQL Server.',
 'Accra', 'Full-Time', '2026-01-15', '2026-04-15', 1),

(2, 2, 'Business Intelligence Analyst',
 'Part-time role creating Power BI dashboards and reports for our clients.',
 'Accra', 'Part-Time', '2026-01-18', '2026-03-30', 1),

(3, 4, 'Accounting Assistant',
 'Graduate programme for accounting graduates interested in finance operations.',
 'Accra', 'Graduate Programme', '2026-01-20', '2026-04-25', 0);

-- ---------- Application (8 applications) ----------
INSERT INTO Application (JobSeekerID, JobID, ApplicationDate, Status, CoverLetter)
VALUES
(1, 1, '2026-01-09', 'Submitted',   'I am passionate about software development and have built several C# projects.'),
(2, 2, '2026-01-11', 'Shortlisted', 'I have strong Excel and Power BI skills and I love working with data.'),
(3, 3, '2026-01-13', 'Submitted',   'I have hands-on experience setting up networks during my internship.'),
(4, 6, '2026-01-21', 'Submitted',   'I am a fresh accounting graduate eager to start my career.'),
(5, 5, '2026-01-19', 'Shortlisted', 'I have built many dashboards in Power BI and I am ready for this role.'),
(1, 4, '2026-01-16', 'Submitted',   'I want to grow as a full-time software developer and this role fits me perfectly.'),
(2, 5, '2026-01-20', 'Submitted',   'Data and analytics is my passion and I would love to join your team.'),
(3, 1, '2026-01-22', 'Rejected',    'I am interested in software development and willing to learn.');
GO

-- ---------- CV (a few sample CVs) ----------
INSERT INTO CV (JobSeekerID, CVTitle, FilePath)
VALUES
(1, 'Larbi_Okyerewa_CV_2026',  'C:\CareerBridge\CVs\larbi_cv.pdf'),
(2, 'Abena_Danso_Data_CV',     'C:\CareerBridge\CVs\abena_cv.pdf'),
(3, 'Kwame_Appiah_Dev_CV',     'C:\CareerBridge\CVs\kwame_cv.pdf');
GO


-- ================================================================
-- PART 6: BASIC SELECT QUERIES
-- ================================================================

-- Query 1: Display all users
SELECT * FROM Users;

-- Query 2: Display all companies
SELECT * FROM Company;

-- Query 3: Display all jobs
SELECT * FROM Job;

-- Query 4: Display only active jobs
SELECT * FROM Job
WHERE IsActive = 1;

-- Query 5: Display all internships
SELECT * FROM Job
WHERE JobType = 'Internship';

-- Query 6: Display all jobs located in Accra
SELECT * FROM Job
WHERE Location = 'Accra';
GO


-- ================================================================
-- PART 7: WHERE, ORDER BY AND FILTERING
-- ================================================================

-- 1. Show jobs posted after 10 January 2026
SELECT * FROM Job
WHERE PostedDate > '2026-01-10';

-- 2. Show jobs whose application deadline has not yet passed
SELECT * FROM Job
WHERE ApplicationDeadline > GETDATE();

-- 3. Show internships in Accra
SELECT * FROM Job
WHERE JobType = 'Internship' AND Location = 'Accra';

-- 4. Display jobs ordered by newest first
SELECT * FROM Job
ORDER BY PostedDate DESC;

-- 5. Display users ordered alphabetically by first name
SELECT * FROM Users
ORDER BY FirstName ASC;
GO


-- ================================================================
-- PART 8: UPDATE PRACTICE
-- ================================================================

-- 1. Change Larbi's phone number (UserID = 1)
UPDATE Users
SET Phone = '0244999888'
WHERE UserID = 1;

-- Verify the change
SELECT UserID, FirstName, LastName, Phone FROM Users WHERE UserID = 1;

-- 2. Change the Accounting Assistant job (JobID = 6) from Active to Closed
UPDATE Job
SET IsActive = 0
WHERE JobID = 6;

-- Verify the change
SELECT JobID, JobTitle, IsActive FROM Job WHERE JobID = 6;

-- 3. Change application status from Submitted to Shortlisted (ApplicationID = 1)
UPDATE Application
SET Status = 'Shortlisted'
WHERE ApplicationID = 1;

-- Verify the change
SELECT ApplicationID, JobSeekerID, JobID, Status FROM Application WHERE ApplicationID = 1;

-- 4. Update TechGhana's website
UPDATE Company
SET CompanyWebsite = 'www.techghanasolutions.com'
WHERE CompanyID = 1;

-- Verify the change
SELECT CompanyID, CompanyName, CompanyWebsite FROM Company WHERE CompanyID = 1;
GO


-- ================================================================
-- PART 9: DELETE PRACTICE
-- ================================================================

-- Step 1: Insert a test category that we will delete
INSERT INTO JobCategory (CategoryName, Description)
VALUES ('Test Category - Delete Me', 'This is a test record for the DELETE exercise.');

-- Confirm it was inserted
SELECT * FROM JobCategory WHERE CategoryName = 'Test Category - Delete Me';

-- Step 2: Delete the test record
DELETE FROM JobCategory
WHERE CategoryName = 'Test Category - Delete Me';

-- Confirm it is gone (should return 0 rows)
SELECT * FROM JobCategory WHERE CategoryName = 'Test Category - Delete Me';
GO


-- ================================================================
-- PART 10: INNER JOIN PRACTICE
-- ================================================================

-- Query 1: Show all jobs together with the company that posted them
SELECT  j.JobTitle,
        c.CompanyName,
        j.Location,
        j.JobType,
        j.ApplicationDeadline
FROM Job j
INNER JOIN Company c ON j.CompanyID = c.CompanyID;

-- Query 2: Show every application together with the Job Seeker's name
SELECT  a.ApplicationID,
        u.FirstName + ' ' + u.LastName AS ApplicantName,
        a.JobID,
        a.ApplicationDate,
        a.Status
FROM Application a
INNER JOIN JobSeeker js ON a.JobSeekerID = js.JobSeekerID
INNER JOIN Users u       ON js.UserID    = u.UserID;

-- Query 3: Show each application with applicant, job, company, date, status
SELECT  u.FirstName + ' ' + u.LastName AS ApplicantName,
        j.JobTitle,
        c.CompanyName,
        a.ApplicationDate,
        a.Status
FROM Application a
INNER JOIN JobSeeker js ON a.JobSeekerID = js.JobSeekerID
INNER JOIN Users u       ON js.UserID    = u.UserID
INNER JOIN Job j         ON a.JobID      = j.JobID
INNER JOIN Company c     ON j.CompanyID  = c.CompanyID;

-- Query 4: Show each job with its category name
SELECT  j.JobTitle,
        jc.CategoryName
FROM Job j
INNER JOIN JobCategory jc ON j.CategoryID = jc.CategoryID;
GO


-- ================================================================
-- PART 11: LEFT JOIN PRACTICE
-- ================================================================

-- Show all jobs, including those that have no applications
SELECT  j.JobTitle,
        c.CompanyName AS Company,
        u.FirstName + ' ' + u.LastName AS ApplicantName
FROM Job j
INNER JOIN Company c     ON j.CompanyID = c.CompanyID
LEFT JOIN Application a  ON j.JobID     = a.JobID
LEFT JOIN JobSeeker js   ON a.JobSeekerID = js.JobSeekerID
LEFT JOIN Users u        ON js.UserID   = u.UserID;
GO


-- ================================================================
-- PART 12: COUNT AND GROUP BY
-- ================================================================

-- 1. Count the total number of users
SELECT COUNT(*) AS TotalUsers FROM Users;

-- 2. Count the total number of jobs
SELECT COUNT(*) AS TotalJobs FROM Job;

-- 3. Count the number of active jobs
SELECT COUNT(*) AS ActiveJobs FROM Job WHERE IsActive = 1;

-- 4. Count how many applications each job has received
SELECT  j.JobTitle,
        COUNT(a.ApplicationID) AS TotalApplications
FROM Job j
LEFT JOIN Application a ON j.JobID = a.JobID
GROUP BY j.JobTitle
ORDER BY TotalApplications DESC;

-- 5. Count how many jobs each company has posted
SELECT  c.CompanyName,
        COUNT(j.JobID) AS TotalJobs
FROM Company c
LEFT JOIN Job j ON c.CompanyID = j.CompanyID
GROUP BY c.CompanyName
ORDER BY TotalJobs DESC;

-- 6. Count applications by application status
SELECT  Status,
        COUNT(*) AS Total
FROM Application
GROUP BY Status
ORDER BY Total DESC;
GO


-- ================================================================
-- PART 13: CHALLENGE QUERIES
-- ================================================================

-- Challenge 1: Show the 5 most recently posted jobs
SELECT TOP 5 *
FROM Job
ORDER BY PostedDate DESC;

-- Challenge 2: Show all applications for TechGhana Solutions (CompanyID = 1)
SELECT  a.ApplicationID,
        u.FirstName + ' ' + u.LastName AS ApplicantName,
        j.JobTitle,
        a.ApplicationDate,
        a.Status
FROM Application a
INNER JOIN Job j         ON a.JobID      = j.JobID
INNER JOIN JobSeeker js  ON a.JobSeekerID = js.JobSeekerID
INNER JOIN Users u       ON js.UserID    = u.UserID
WHERE j.CompanyID = 1;

-- Challenge 3: Show all applications made by Larbi (JobSeekerID = 1)
SELECT  a.ApplicationID,
        j.JobTitle,
        c.CompanyName,
        a.ApplicationDate,
        a.Status
FROM Application a
INNER JOIN Job j     ON a.JobID     = j.JobID
INNER JOIN Company c ON j.CompanyID = c.CompanyID
WHERE a.JobSeekerID = 1;

-- Challenge 4: Show jobs that have received more than 2 applications
SELECT  j.JobTitle,
        COUNT(a.ApplicationID) AS TotalApplications
FROM Job j
INNER JOIN Application a ON j.JobID = a.JobID
GROUP BY j.JobTitle
HAVING COUNT(a.ApplicationID) > 2;

-- Challenge 5: Show the company with the highest number of job postings
SELECT TOP 1
        c.CompanyName,
        COUNT(j.JobID) AS TotalJobs
FROM Company c
INNER JOIN Job j ON c.CompanyID = j.CompanyID
GROUP BY c.CompanyName
ORDER BY TotalJobs DESC;
GO

-- ================================================================
-- END OF SCRIPT
-- ================================================================