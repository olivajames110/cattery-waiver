import { Text } from "@react-email/components";
import React, { useMemo } from "react";
import { emailStylesText } from "../styles/emailStylesText";

const EmailTextPrimary = ({ children, center, bold, suppressMargin, marginBottom, marginTop, style = {} }) => {
  const styles = useMemo(() => {
    let sty = {
      ...emailStylesText,
      textAlign: center ? "center" : "left",
      fontWeight: bold ? "bold" : "normal",
      marginBottom: "14px",
      // margin: "24px 0",
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

    return { ...sty, ...style };
  }, [center, bold, suppressMargin, marginBottom, marginTop, style]);
  return <Text style={styles}>{children}</Text>;
};

export default EmailTextPrimary;
