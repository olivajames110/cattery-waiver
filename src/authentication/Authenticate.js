import { useStytchMemberSession } from "@stytch/react/b2b";
import { Navigate } from "react-router-dom";
import LoginScreen from "../screens/LoginScreen";
import AuthenticateError from "./AuthenticateError";

const Authenticate = () => {
  const { session } = useStytchMemberSession();

  if (session) {
    console.log("True", session);
    return <Navigate to="/" />;
  }

  // return <AuthenticateError />;
  return <LoginScreen />;
};

export default Authenticate;
