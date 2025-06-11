import { Body } from "@react-email/components";
import React from "react";

const EmailBody = ({ children }) => {
  const main = {
    backgroundColor: "#fff",
    color: "#212121",
  };
  return <Body style={main}>{children}</Body>;
};

export default EmailBody;
