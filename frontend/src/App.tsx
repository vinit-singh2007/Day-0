import { Routes, Route, Link, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Simulation from "./pages/Simulation";
import DashboardLayout from "./components/layout/DashboardLayout";
import { useState } from "react";
import ProtectedRoute from "./components/routes/ProtectedRoutes";
import Underconstruction from "./pages/Underconstruction";


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("isLoggedIn") === "false";
  });
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={<LandingPage />}
        />

        {/* Login Page */}
        <Route
          path="/login"
          element={
            <div>
              <header className="flex justify-between items-center px-6 py-4 border-b border-border">
                <Link
                  to="/"
                  className="font-display font-bold text-lg cursor-pointer"
                >
                  DAY 0
                </Link>

                <Link
                  to="/"
                  className="text-xs font-semibold px-4 py-2 border border-border rounded-sm hover:bg-muted"
                >
                  Back to Home
                </Link>
              </header>

              <LoginPage  setIsAuthenticated={setIsAuthenticated}/>
            </div>
          }
        />

       <Route element={<ProtectedRoute isAuthenticated={isAuthenticated}/>}>
        <Route
        path="/dashboard"
        element={<DashboardLayout />}
        >
            {/* Dashboard */}
        <Route
          index
          element={<Dashboard />}
        />

        {/* Simulation*/}
        <Route
          path="/dashboard/simulation"
          element={<Simulation />}
        />
        <Route
          path="/dashboard/path"
          element={<Underconstruction />}
        />
        </Route>
       </Route>
       <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
};

export default App;