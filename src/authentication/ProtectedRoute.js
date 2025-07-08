import { Navigate } from "react-router-dom";
import { useAuthHook } from "../hooks/useAuthHook";

const ProtectedRoute = ({ children }) => {
  const { auth } = useAuthHook();
  return auth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
