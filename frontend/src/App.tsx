import { useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Simulation from "./pages/Simulation";
import Underconstruction from "./pages/Underconstruction";
import { AssessmentPage } from "./pages/SkillAssessment";

import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/routes/ProtectedRoutes";

const App = () => {
  // LocalStorage se login state parse kar rahe hain
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/login"
          element={
            <div>
              <header className="flex items-center justify-between border-b border-border px-6 py-4">
                <Link
                  to="/"
                  className="font-display cursor-pointer text-lg font-bold"
                >
                  DAY 0
                </Link>

                <Link
                  to="/"
                  className="rounded-sm border border-border px-4 py-2 text-xs font-semibold hover:bg-muted"
                >
                  Back to Home
                </Link>
              </header>

              <LoginPage setIsAuthenticated={setIsAuthenticated} />
            </div>
          }
        />

        {/* Protected Routes (Wrapper) */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          {/* Main Dashboard Layout Wrapper */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            
            {/* Main /dashboard Page */}
            <Route index element={<Dashboard />} />

            {/* Sub-Pages (Render inside DashboardLayout's <Outlet />) */}
            <Route path="simulation" element={<Simulation />} />
            <Route path="assessment/:path?" element={<AssessmentPage />} />
            <Route path="path" element={<Underconstruction />} />
          </Route>
        </Route>

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
};

export default App;