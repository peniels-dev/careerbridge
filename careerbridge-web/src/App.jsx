import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";

import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/JobSeekerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";

import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import PublicCompanyProfile from "./pages/PublicCompanyProfile";
import ApplyJob from "./pages/ApplyJob";

import MyCVs from "./pages/MyCVs";
import MyApplications from "./pages/MyApplications";
import Profile from "./pages/Profile";

import EmployerJobs from "./pages/EmployerJobs";
import PostJob from "./pages/PostJob";
import EmployerApplicants from "./pages/EmployerApplicants";
import EmployerApplicantProfile from "./pages/EmployerApplicantProfile";
import CompanyProfile from "./pages/CompanyProfile";
import EmployerJobDetails from "./pages/EmployerJobDetails";
import EditJob from "./pages/EditJob";

// ADMIN
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminApplications from "./pages/admin/AdminApplications";

function App() {
    return (
        <Routes>

            {/* =========================
                LOGIN
            ========================= */}

            <Route
                path="/"
                element={<Login />}
            />

            <Route
                path="/login"
                element={<Login />}
            />


            {/* =========================
                REGISTER
            ========================= */}

            <Route
                path="/register"
                element={<Register />}
            />


            {/* =========================
                UNAUTHORIZED
            ========================= */}

            <Route
                path="/unauthorized"
                element={<Unauthorized />}
            />


            {/* =========================
                JOB SEEKER ROUTES
            ========================= */}

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["JobSeeker"]}>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/jobs"
                element={
                    <ProtectedRoute allowedRoles={["JobSeeker"]}>
                        <Jobs />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/jobs/:id"
                element={
                    <ProtectedRoute allowedRoles={["JobSeeker"]}>
                        <JobDetails />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/companies/:id"
                element={
                    <ProtectedRoute>
                        <PublicCompanyProfile />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/jobs/:id/apply"
                element={
                    <ProtectedRoute allowedRoles={["JobSeeker"]}>
                        <ApplyJob />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/my-cvs"
                element={
                    <ProtectedRoute allowedRoles={["JobSeeker"]}>
                        <MyCVs />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/my-applications"
                element={
                    <ProtectedRoute allowedRoles={["JobSeeker"]}>
                        <MyApplications />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/profile"
                element={
                    <ProtectedRoute allowedRoles={["JobSeeker"]}>
                        <Profile />
                    </ProtectedRoute>
                }
            />


            {/* =========================
                EMPLOYER ROUTES
            ========================= */}

            <Route
                path="/employer-dashboard"
                element={
                    <ProtectedRoute allowedRoles={["Employer"]}>
                        <EmployerDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/employer/jobs"
                element={
                    <ProtectedRoute allowedRoles={["Employer"]}>
                        <EmployerJobs />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/employer/jobs/:id"
                element={
                    <ProtectedRoute allowedRoles={["Employer"]}>
                        <EmployerJobDetails />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/employer/jobs/:id/edit"
                element={
                    <ProtectedRoute allowedRoles={["Employer"]}>
                        <EditJob />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/employer/post-job"
                element={
                    <ProtectedRoute allowedRoles={["Employer"]}>
                        <PostJob />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/employer/jobs/:id/applicants"
                element={
                    <ProtectedRoute allowedRoles={["Employer"]}>
                        <EmployerApplicants />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/employer/jobs/:jobId/applicants/:applicationId/profile"
                element={
                    <ProtectedRoute allowedRoles={["Employer"]}>
                        <EmployerApplicantProfile />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/company-profile"
                element={
                    <ProtectedRoute allowedRoles={["Employer"]}>
                        <CompanyProfile />
                    </ProtectedRoute>
                }
            />


            {/* =========================
                ADMIN ROUTES
            ========================= */}

            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route
                    index
                    element={<AdminDashboard />}
                />

                <Route
                    path="users"
                    element={<AdminUsers />}
                />

                <Route
                    path="jobs"
                    element={<AdminJobs />}
                />

                <Route
                    path="applications"
                    element={<AdminApplications />}
                />
            </Route>

        </Routes>
    );
}

export default App;