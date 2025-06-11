import { Container, Section } from "@react-email/components";
import React, { useMemo } from "react";

const EmailContainer = ({ children, center, style }) => {
  const styles = useMemo(() => {
    let sty = { padding: "20px", margin: "0 auto", backgroundColor: "#eee" };

    return { ...sty, ...style };
  }, [style]);
  return <Container style={styles}>{children}</Container>;
};

export default EmailContainer;
