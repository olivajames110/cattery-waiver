import { useStytchMemberSession } from "@stytch/react/b2b";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoutes = ({ children }) => {
  const { session, fromCache } = useStytchMemberSession();

  if (!session && !fromCache) {
    console.log("No session found, redirecting...");
    return <Navigate to="/login" />;
  }

  if (!session) {
    return <div>Loading...</div>;
  }

  return children;
};
