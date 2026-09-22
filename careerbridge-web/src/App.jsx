import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route
                path="/unauthorized"
                element={<Unauthorized />}
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
             <Route path="/jobs" element={<Jobs />} />
             <Route path="/jobs/:id" element={<JobDetails />} />
        </Routes>
        
    );
}

export default App;