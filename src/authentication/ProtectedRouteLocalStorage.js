import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ProtectedRouteLocalStorage = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // Show a loading state while checking auth
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRouteLocalStorage;
