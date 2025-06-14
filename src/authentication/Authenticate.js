import { useStytchMemberSession } from "@stytch/react/b2b";
import { Navigate } from "react-router-dom";
import WaiverFormScreen from "../screens/WaiverFormScreen";

const Authenticate = () => {
  const { session } = useStytchMemberSession();

  if (session) {
    console.log("True", session);
    return <Navigate to="/" />;
  }

  // return <AuthenticateError />;
  return <WaiverFormScreen />;
  // return <LoginScreen />;
};

export default Authenticate;
