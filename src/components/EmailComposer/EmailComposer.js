import { grey } from "@mui/material/colors";
import React from "react";

import { EditRounded, SendRounded } from "@mui/icons-material";
import { Button, Card, IconButton, Modal, TextField } from "@mui/material";

// import EmailBuilderTemplateRender from "../EmailBuilder/EmailBuilderTemplateRender";
// import { emailBuilderTypes } from "../EmailBuilder/config/emailBuilderTypes";
import Flx from "../layout/Flx";
import ModalContent from "../modals/shared/ModalContent";
import Txt from "../typography/Txt";
import { emailBuilderTypes } from "./config/emailBuilderTypes";
import EmailBuilderTemplateRender from "./EmailBuilderTemplateRender";

const EmailComposer = ({ children }) => {
  return (
    <ModalContent
      sx={{
        background: grey[300],
        overflow: "hidden",
        width: "100%",
        height: "100%",
        pt: 0,
      }}
    >
      <Flx column sx={{ height: "100%" }}>
        <ComposerHeader />
        <ComposerMain />
      </Flx>
    </ModalContent>
  );
};

const ComposerHeader = ({ props }) => {
  const emailFrom = "jo@flatironrealtycapital.com";
  const styles = {
    height: "100%",
    // width: "60px",
    // lineHeight: "14px",
    // textAlign: "left",
    //
    // padding: 0,
  };
  return (
    <Card sx={{ flexGrow: 0, flexShrink: 0, mt: 1.5, mb: 2 }}>
      <Flx
        fw
        // ac
        //
        jb
        g={2}
        wrap
        sx={{ height: "100%" }}
      >
        <Flx sx={{ flexGrow: 0, flexBasis: "620px" }} column g={8}>
          <HeaderInputItem label="Email To:">
            <TextField
              variant="standard"
              size="small"
              sx={{ flexGrow: 1 }}
              fullWidth={false}
            />
          </HeaderInputItem>

          <HeaderInputItem label="Subject:">
            <TextField
              variant="standard"
              size="small"
              sx={{ flexGrow: 1 }}
              fullWidth={false}
            />
          </HeaderInputItem>
        </Flx>
        <Flx column g={8} sx={{ alignItems: "flex-end", flexGrow: 1 }}>
          <Flx g={8} sx={{ height: "100%" }}>
            <Button sx={styles} variant="outlined">
              Apply Template
            </Button>
            <Button sx={styles} variant="outlined">
              Send Test Email
            </Button>

            <Button endIcon={<SendRounded />}>Send Email</Button>
          </Flx>

          <Txt sx={{ fontStyle: "italic", color: grey[600], fontSize: "12px" }}>
            From: {emailFrom}
          </Txt>
        </Flx>
      </Flx>
    </Card>
  );
};

const ComposerMain = ({ props }) => {
  return (
    <Card
      sx={{
        //
        // flexGrow: 1,
        // flexShrink: 1,
        // overflowY: "auto",
        p: 0,
      }}
    >
      <OverflowContainerWrapper>
        <OverflowContainerHeader>
          <ComposerMainToolbar />
        </OverflowContainerHeader>
        <OverflowContainerContent>
          <EmailBuilderTemplateRender emailData={emailDataJson} />
        </OverflowContainerContent>
      </OverflowContainerWrapper>
    </Card>
  );
  // return (
  //   <Card sx={{ flexGrow: 1, flexShrink: 1, overflowY: "auto", p: 0 }}>
  //     <ComposerMainToolbar />
  //     <EmailBuilderTemplateRender emailData={emailDataJson} />
  //   </Card>
  // );
  // return (
  //   <Card sx={{ flexGrow: 1, flexShrink: 1, overflowY: "auto", p: 0 }}>
  //     <EmailBuilderTemplateRender emailData={emailDataJson} />
  //   </Card>
  // );
};
const ComposerMainToolbar = ({ props }) => {
  return (
    <ModalContent sx={{ borderBottom: "1px solid #dddddd" }}>
      <Flx fw jb ac>
        <Txt bold>Email Preview</Txt>
        <IconButton size="small">
          <EditRounded />
        </IconButton>
      </Flx>
      {/* <EmailBuilderTemplateRender emailData={emailDataJson} /> */}
    </ModalContent>
  );
};

const HeaderInputItem = ({ label, children }) => {
  return (
    <Flx
      g={10}
      ac
      sx={{
        ".MuiInputBase-root": {
          background: grey[100],
          padding: 0.4,
          pl: 0.8,
          border: `1px solid ${grey[300]}`,
        },
      }}
    >
      <Txt sx={{ textAlign: "right", flexBasis: "58px", flexShrink: 1 }}>
        {label}
      </Txt>
      {children}
    </Flx>
  );
};

const OverflowContainerWrapper = ({ children }) => {
  return (
    <Flx fw column sx={{ height: "100%" }}>
      {children}
    </Flx>
  );
};

const OverflowContainerHeader = ({ children }) => {
  return (
    <Flx fw sx={{ FlxGrow: 0, flexShrink: 0 }}>
      {children}
    </Flx>
  );
};
const OverflowContainerContent = ({ children }) => {
  return (
    <Flx fw sx={{ height: "100%", flexGrow: 1, overflowY: "auto" }}>
      {children}
    </Flx>
  );
};

const emailDataJson = {
  preview: "Flatiron Follow Up Email",
  sections: [
    {
      type: emailBuilderTypes.EmailTextPrimary,
      content: "Hello James,",
    },
    {
      type: emailBuilderTypes.EmailTextPrimary,
      content:
        "Hope all is well! It's been a while since we last spoke and I wanted to follow up with you and see if you had anything going on I can help fund? I'd love to help with your client's or your next project.",
    },
    {
      type: emailBuilderTypes.EmailTextPrimary,
      content: "See below for our lending terms and documentation necessary",
    },

    {
      type: emailBuilderTypes.EmailList,
      title: "12 Month Fix & Flip/Bridge Loan Parameters",
      items: [
        "Loan to Cost: Up to 85%",
        "Rehab/Reno Financing: Up to 100%",
        "Interest Rates: Starting at 10.99%",
        "Lending Term: 1 Year With a 4-Month Minimum",
        "Closing Time: As Fast as 24 Hours With Clear Title & Appraisal",
        "Amortization: Interest-Only",
        "Minimum Credit Score: 660 FICO",
        "Foreclosure/Bailouts (Case by Case)",
        "Mid-Construction Jobs are Financeable",
      ],
    },
    {
      type: emailBuilderTypes.EmailList,
      title: "Ground up Construction Parameters",
      items: [
        "Lending Term: 12-18 Month Bridge Loan",
        "Loan to Cost: Up to 65% on land with approved plans, Up to 70% of your construction budget",
        "Interest Rates: Starting at 10.99%",
        "Amortization: Interest-Only",
      ],
    },
    {
      type: emailBuilderTypes.EmailTextPrimary,
      content:
        "Look forward to hearing from you soon. If you have any questions or scenarios feel free to reach me on my personal cell.",
    },
  ],
  signature: {
    name: "James Oliva",
    title: "Account Executive",
    company: "Flatiron Realty Capital",
    phone: "(631) 456-3373",
    email: "jo@flatironrealtycapital.com",
    website: "https://flatironrealtycapital.com/",
    image:
      "https://media.licdn.com/dms/image/v2/C4E0BAQHGJOmc_jS8HA/company-logo_200_200/company-logo_200_200/0/1659372156556/flatiron_realty_capital_logo?e=2147483647&v=beta&t=Y_31uPKujyKYyixPtTt9c5k32z5KAjlSSSjKZeLldGg",
  },
};
export default EmailComposer;
