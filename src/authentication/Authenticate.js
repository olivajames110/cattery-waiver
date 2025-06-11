import { useStytchMemberSession } from "@stytch/react/b2b";
import { Navigate } from "react-router-dom";
import CatteryWaiverScreen from "../screens/CatteryWaiverScreen";

const Authenticate = () => {
  const { session } = useStytchMemberSession();

  if (session) {
    console.log("True", session);
    return <Navigate to="/" />;
  }

  // return <AuthenticateError />;
  return <CatteryWaiverScreen />;
  // return <LoginScreen />;
};

export default Authenticate;
