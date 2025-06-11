import React from "react";
import { Section } from "@react-email/components";

const EmailSection = ({ children, style }) => {
  return <Section style={style}>{children}</Section>;
};

export default EmailSection;
