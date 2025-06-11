// import { useStytch } from "@stytch/react";
import { StytchB2B, useStytchMemberSession } from "@stytch/react/b2b";

import { AuthFlowType, B2BProducts } from "@stytch/vanilla-js";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import ResilenderLogo from "../assets/ResilenderLogo";
import AuthenticateError from "../authentication/AuthenticateError";
import Flx from "../components/layout/Flx";

const LoginScreen = () => {
  const { session, member } = useStytchMemberSession();
  const [error, setError] = useState(false);
  if (session) {
    return <Navigate to="/" />;
  }

  const config = {
    products: [B2BProducts.emailMagicLinks],
    sessionOptions: { sessionDurationMinutes: 10080 },
    authFlowType: AuthFlowType.Discovery,
    emailMagicLinksOptions: {
      loginRedirectURL: `${window.location.origin}/authenticate`,
      discoveryRedirectURL: `${window.location.origin}/authenticate`,
    },
    ssoOptions: {
      loginRedirectURL: `${window.location.origin}/authenticate`,
      discoveryRedirectURL: `${window.location.origin}/authenticate`,
    },
  };

  if (error) {
    return <AuthenticateError />;
  }

  return (
    <Flx
      center
      column
      sx={{
        p: 2,
        div: {
          border: "none",
        },
      }}
    >
      {/* <LoginButton /> */}
      <ResilenderLogo width="140px" sx={{ mt: 6, mb: 0 }} />
      <StytchB2B
        config={config}
        callbacks={{
          onError: () => {
            setError(true);
          },
        }}
        styles={{
          fontFamily: `"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell,
        "Helvetica Neue", sans-serif`,
          buttons: {
            primary: {
              backgroundColor: "#2962ff",
              borderColor: "#2962ff",
            },
          },
          container: {
            borderColor: "#00000024",
          },
          inputs: {
            borderColor: "#0000003b",
          },
        }}
      />
    </Flx>
  );
};

export default LoginScreen;
