import React from "react";
import { Section, Text } from "@react-email/components";
import { Container } from "@mui/material";
import EmailTextPrimary from "./EmailTextPrimary";
import { emailStylesText } from "../styles/emailStylesText";
import EmailSection from "./EmailSection";

const EmailList = ({ title, list }) => {
  return (
    <EmailSection style={{ marginTop: "10px" }}>
      <EmailTextPrimary marginBottom="6px" bold>
        {title}
      </EmailTextPrimary>

      <ul style={{ paddingLeft: "20px", margin: "0" }}>
        {list?.map((l) => (
          <EmailListItem key={l}>{l}</EmailListItem>
        ))}
      </ul>
    </EmailSection>
  );
};

const EmailListItem = ({ children }) => {
  return (
    <li
      style={{
        ...emailStylesText,

        marginTop: "0px",
        marginRight: "0",
        marginBottom: "8px",
        marginLeft: "12px",
      }}
    >
      {children}
    </li>
  );
};

export default EmailList;
