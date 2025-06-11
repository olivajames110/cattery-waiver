import React from "react";

import { emailStylesLink } from "../styles/emailStylesLink";
import { Link } from "@react-email/components";

const EmailLink = ({ children, href, style }) => {
  return (
    <Link href={href} target="_blank" style={{ ...emailStylesLink, ...style }}>
      {children}
    </Link>
  );
};

export default EmailLink;
