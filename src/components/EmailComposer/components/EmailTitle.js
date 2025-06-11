import { Heading } from "@react-email/components";
import React, { useMemo } from "react";

const EmailTitle = ({ children, h1, h2, h3, center, suppressMargin, marginBottom, marginTop, style = {} }) => {
  const styles = useMemo(() => {
    let sty = {
      color: "#333",
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      fontSize: "20px",
      fontWeight: "bold",
      textAlign: center ? "center" : "left",
      marginBottom: "15px",
    };

    if (suppressMargin) {
      sty = { ...sty, margin: "0", marginLeft: "0", marginRight: "0", marginBottom: "0", marginTop: "0" };
    }

    if (marginBottom) {
      sty = { ...sty, marginBottom: marginBottom };
    }

    if (marginTop) {
      sty = { ...sty, marginTop: marginTop };
    }

    if (h2) {
      sty = { ...sty, fontSize: "17px" };
    }

    if (h3) {
      sty = { ...sty, fontSize: "15px" };
    }

    return { ...sty, ...style };
  }, [center, h2, h3, suppressMargin, marginBottom, marginTop, style]);

  return <Heading style={styles}>{children}</Heading>;
};

export default EmailTitle;
