import {
  Box,
  Card,
  CircularProgress,
  Container,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { grey, red } from "@mui/material/colors";

import { useState } from "react";
import magicLinkGuide from "../assets/stytch-login-troubleshoot.png";
import Flx from "../components/layout/Flx";
import Txt from "../components/typography/Txt";
import { Link } from "react-router-dom";
import { ErrorOutline } from "@mui/icons-material";
import ResilenderLogo from "../assets/ResilenderLogo";
const AuthenticateError = () => {
  return (
    <Container maxWidth="lg">
      <Flx column gap={4} sx={{ py: 4, px: 2 }}>
        <ResilenderLogo width="140px" sx={{ m: "0 auto" }} />
        <Box>
          <Flx
            wrap
            ac
            gap={2}
            sx={{ p: 2, background: red[50], borderRadius: 1 }}
          >
            <ErrorOutline sx={{ fontSize: 48, color: "#d32f2f" }} />
            <Flx jc column sx={{ mt: "0px" }} gap={0}>
              <Typography variant="h3" fontWeight={700} color="error">
                Authentication Error
              </Typography>
              <Typography color="error">
                It looks like we're having trouble logging you in.
              </Typography>
            </Flx>
          </Flx>
        </Box>
        <Box>
          <Typography variant="h4" gutterBottom>
            Troubleshooting
          </Typography>
          <Card sx={{ p: 3, borderRadius: 1 }}>
            <Flx column gap={4}>
              <Flx column gap={1}>
                <Txt bold>Important</Txt>
                <Flx column gap={0.4}>
                  <Txt>
                    To ensure the magic link login works correctly, you must{" "}
                    <b>open the email link in the same browser</b> you used to
                    request the link.
                  </Txt>
                  <Txt sx={{ color: grey[700], fontStyle: "italic" }}>
                    For example, if you started the login in Google Chrome, but
                    after clicking the link in your email you are brought to
                    Microsoft Edge, the login will fail.
                  </Txt>
                </Flx>
              </Flx>
              <Flx column gap={8} sx={{ mt: 3 }}>
                <Flx fw sx={{ justifyContent: "space-around" }} gap={1} wrap>
                  <Flx
                    column
                    gap={1}
                    sx={{ flexShrink: 1, flexBasis: "500px" }}
                  >
                    <Txt bold>To continue in this current browser:</Txt>
                    <Flx ac wrap gap={0.4}>
                      <Link to={"/login"}>
                        <Txt>Click here</Txt>
                      </Link>
                      <Txt>
                        to be redirected to the login page in this browser.
                      </Txt>
                    </Flx>
                  </Flx>
                  <Box
                    sx={{
                      p: 1,
                      width: "100%",
                      maxWidth: "340px",
                    }}
                  />
                </Flx>
                <Flx fw ac sx={{ justifyContent: "space-around" }} gap={1} wrap>
                  <Flx column sx={{ flexShrink: 1, flexBasis: "500px" }}>
                    <Txt bold>To fix this & use your previous browser:</Txt>

                    <Txt sx={{ color: grey[700] }}>
                      <List
                        component="ol"
                        sx={{
                          pl: 4,
                          listStyleType: "decimal",
                          "& .MuiListItem-root": {
                            display: "list-item",
                            pl: 1,
                          },
                        }}
                      >
                        <ListItem component="li">
                          Go back to the login page in desired browser.
                        </ListItem>
                        <ListItem component="li">
                          Enter your email address again and click "Send Magic
                          Link".
                        </ListItem>
                        <ListItem component="li">
                          Go to your email inbox and find the magic link email.
                        </ListItem>
                        <ListItem component="li">
                          Do not click the button, but instead, right click the
                          button and press "Copy link" or "Copy link address"
                        </ListItem>
                        <ListItem component="li">
                          Go back to the browser where you entered your email
                          address and paste the link into the address bar. Press
                          enter.
                        </ListItem>
                      </List>
                    </Txt>
                  </Flx>
                  <Box
                    component="img"
                    src={magicLinkGuide}
                    sx={{
                      p: 1,
                      borderRadius: "8px",
                      border: `1px solid ${grey[300]}`,
                      width: "100%",
                      maxWidth: "340px",
                      height: "auto",
                    }}
                  />
                </Flx>
              </Flx>
            </Flx>
          </Card>
        </Box>
      </Flx>
    </Container>
  );
};

export default AuthenticateError;
