import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  // Pass your auth state here or get it from Context/Redux
  isAuthenticated: boolean; 
}

const ProtectedRoute = ({ isAuthenticated }: ProtectedRouteProps) => {
  // Agar user authenticated nahi hai, toh login page par bhej do
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Agar authenticated hai, toh child routes (Dashboard, etc.) render karo
  return <Outlet />;
};

export default ProtectedRoute;