import { Text } from "@react-email/components";
import React from "react";
import { emailStylesText } from "../styles/emailStylesText";

const EmailTextFooter = ({ children }) => {
  const styles = { ...emailStylesText, fontSize: "12px", padding: "0 20px" };
  return <Text style={styles}>{children}</Text>;
};

export default EmailTextFooter;
