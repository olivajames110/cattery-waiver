import { LogoutOutlined } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import React, { useCallback, useState } from "react";
// import { useAuth } from "../authentication/AuthProvider";
// import { useStytch } from "@stytch/react";
import { useNavigate } from "react-router-dom";
import LinkListItem from "./components/LinkListItem";
import { useStytchB2BClient } from "@stytch/react/b2b";

const NavLinkLogoutButton = ({ collapsed, redirectPath = "/login" }) => {
  // const { logout } = useAuth();
  // const { stytch } = useStytch();

  const [loading, setLoading] = useState(false);
  // const handleLogout = async () => {
  //   setLoading(true);
  //   try {
  //     // Revoke the session with Stytch
  //     // await stytch.session.revoke();

  //     // Clear any local storage values if needed
  //     // localStorage.removeItem('your-auth-related-key');

  //     // Redirect to login page
  //     navigate(redirectPath, { replace: true });
  //   } catch (error) {
  //     console.error("Logout error:", error);
  //     // Force redirect even if there was an error
  //     navigate(redirectPath, { replace: true });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const stytch = useStytchB2BClient();
  const navigate = useNavigate();
  const handleLogout = useCallback(async () => {
    await stytch.session.revoke();
    navigate("/");
  }, [stytch, navigate]);
  if (collapsed) {
    return (
      <Tooltip placement="top-end" arrow title="Logout">
        <IconButton onClick={handleLogout} sx={{ borderRadius: "0" }}>
          <LogoutOutlined sx={{ transform: "rotate(180deg)" }} />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <LinkListItem
      collapsed={collapsed}
      icon={
        <LogoutOutlined
          sx={{ transform: "rotate(180deg)", fontSize: "16px !important" }}
        />
      }
      onClick={handleLogout}
      label="Logout"
    />
  );
  // return (
  //   <Button
  //     sx={{ fontWeight: `400 !important` }}
  //     startIcon={
  //       <LogoutOutlined
  //         sx={{ transform: "rotate(180deg)", fontSize: "16px !important" }}
  //       />
  //     }
  //     variant="text"
  //     size="large"
  //     color="inherit"
  //     onClick={logout}
  //   >
  //     Logout
  //   </Button>
  // );
};
export default NavLinkLogoutButton;
