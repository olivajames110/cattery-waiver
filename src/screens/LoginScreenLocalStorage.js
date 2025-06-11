import { useEffect, useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../authentication/AuthProvider";
import Htag from "../components/typography/Htag";
import ResilenderLogo from "../assets/ResilenderLogo";
import Flx from "../components/layout/Flx";
import TextInput from "../components/inputs/TextInput";
import Txt from "../components/typography/Txt";
import { Button, useMediaQuery } from "@mui/material";
import { OpenInNew } from "@mui/icons-material";

const LoginScreenLocalStorage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Get URL query parameters
  const [token, setToken] = useState("");
  const isMobile = useMediaQuery(`(max-width:768px)`);
  useEffect(() => {
    const queryToken = searchParams.get("token");
    if (queryToken) {
      login(queryToken);
      navigate("/"); // Redirect immediately after auto-login
    }
  }, [searchParams, login, navigate]);

  const handleLogin = (event) => {
    event.preventDefault();
    login(token);
    navigate("/");
  };

  return (
    <Flx center column sx={{ p: 1 }}>
      <ResilenderLogo width="140px" sx={{ mt: 6, mb: 6 }} />
      <Flx gap={1} center column>
        <Htag h1>Temporary Login</Htag>
        <Txt sx={{ textAlign: "center" }}>
          This is an example login page with authentication.
        </Txt>
        <Flx gap={1} center column sx={{ mt: 2 }}>
          <form onSubmit={handleLogin}>
            <TextInput
              size="large"
              type="text"
              placeholder="Enter anything here"
              value={token}
              onChange={(e) => setToken(e)}
              required
            />
            <Button size="large" fullWidth type="submit" sx={{ mt: 1 }}>
              Login
            </Button>
          </form>
        </Flx>
        {isMobile ? (
          <Flx column sx={{ mt: 8 }} gap={4}>
            <ExternalLinkCard url={`/loan-application`}>
              To Loan Application
            </ExternalLinkCard>
            {/* <ExternalLinkCard url={`${window.location.origin}/credit-auth`}> */}
            <ExternalLinkCard url={`/credit-auth`}>
              To Credit Authorization
            </ExternalLinkCard>
          </Flx>
        ) : null}
      </Flx>
    </Flx>
  );
};

const ExternalLinkCard = ({ url, children }) => {
  const navigate = useNavigate();
  return (
    <Button
      // role="link"
      // href={url}
      variant="outlined"
      // target="_blank"
      onClick={() => navigate(url)}
      startIcon={<OpenInNew sx={{ fontSize: "22px !important" }} />}
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 6,
        gap: 2,
        width: 180,
        height: 180,
        fontWeight: 500,
      }}
      // onClick={handleCopyToClipboard}
    >
      {children}
    </Button>
  );
};
export default LoginScreenLocalStorage;
