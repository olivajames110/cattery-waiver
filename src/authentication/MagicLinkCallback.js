// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useStytch } from "@stytch/react";
// import { CircularProgress, Alert, Box, Typography, Paper } from "@mui/material";
// import ResilenderLogo from "../assets/ResilenderLogo";
// import Flx from "../components/layout/Flx";

const MagicLinkCallback = () => {
  // const { stytch } = useStytch();
  // const navigate = useNavigate();
  // const [error, setError] = useState("");
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // Parse the URL for the token
  //   const params = new URLSearchParams(window.location.search);
  //   const token = params.get("token");

  //   if (!token) {
  //     setError("No authentication token found");
  //     setLoading(false);
  //     return;
  //   }

  //   // Authenticate the magic link token
  //   const authenticateToken = async () => {
  //     try {
  //       const response = await stytch.magicLinks.authenticate(token, {
  //         session_duration_minutes: 60 * 24, // 24 hours
  //       });

  //       // Successful authentication, redirect to dashboard
  //       navigate("/dashboard", { replace: true });
  //     } catch (err) {
  //       console.error("Authentication error:", err);
  //       setError(
  //         `Authentication failed: ${err.error_message || "Invalid or expired token"}`
  //       );
  //       setLoading(false);
  //     }
  //   };

  //   authenticateToken();
  // }, [stytch, navigate]);

  // if (loading) {
  //   return (
  //     <Flx center column sx={{ height: "100vh" }}>
  //       <ResilenderLogo width="140px" sx={{ mb: 4 }} />
  //       <CircularProgress size={40} />
  //       <Typography variant="h6" sx={{ mt: 3 }}>
  //         Authenticating...
  //       </Typography>
  //     </Flx>
  //   );
  // }

  // if (error) {
  //   return (
  //     <Flx center column sx={{ height: "100vh", p: 2 }}>
  //       <ResilenderLogo width="140px" sx={{ mb: 4 }} />
  //       <Paper elevation={3} sx={{ p: 3, maxWidth: 450 }}>
  //         <Alert severity="error" sx={{ mb: 2 }}>
  //           {error}
  //         </Alert>
  //         <Typography variant="body1" sx={{ mb: 2 }}>
  //           There was a problem with your authentication link. The link may have
  //           expired or is invalid.
  //         </Typography>
  //         <Box sx={{ mt: 2 }}>
  //           <Typography
  //             component="button"
  //             variant="body2"
  //             onClick={() => navigate("/login", { replace: true })}
  //             sx={{
  //               color: "primary.main",
  //               cursor: "pointer",
  //               textDecoration: "underline",
  //               background: "none",
  //               border: "none",
  //               p: 0,
  //             }}
  //           >
  //             Return to login
  //           </Typography>
  //         </Box>
  //       </Paper>
  //     </Flx>
  //   );
  // }

  return null;
};

export default MagicLinkCallback;
