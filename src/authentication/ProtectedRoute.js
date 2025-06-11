import { useStytchB2BClient, useStytchMember } from "@stytch/react/b2b";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Grab the member info & status from Stytch B2B

  const { member } = useStytchMember();
  // const tokens = stytch.session.getTokens();
  console.log("PROTECTED ROUTE: Member", member);
  // if (status === "loading") {
  //   return <div>Loading...</div>;
  // }

  // If no member is logged in, redirect to login
  if (!member) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
