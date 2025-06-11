import { Section } from "@react-email/components";
import React, { useMemo } from "react";

const EmailSectionContent = ({
  children,
  center,
  style,
  suppressHoriztonalPadding,
  suppressVerticallPadding,
  suppressPadding,
  paddingTop,
  paddingBottom,
}) => {
  const styles = useMemo(() => {
    let sty = { padding: "25px 35px" };

    if (center) {
      sty = { ...sty, display: "flex", alignItems: "center", justifyContent: "center" };
    }
    if (suppressPadding) {
      sty = { ...sty, paddingTop: "0", paddingBottom: "0", paddingLeft: "0", paddingRight: "0" };
    }
    if (suppressHoriztonalPadding) {
      sty = { ...sty, paddingLeft: "0", paddingRight: "0" };
    }
    if (suppressVerticallPadding) {
      sty = { ...sty, paddingTop: "0", paddingBottom: "0" };
    }

    if (paddingTop) {
      sty = { ...sty, paddingTop: paddingTop };
    }

    if (paddingBottom) {
      sty = { ...sty, paddingBottom: paddingBottom };
    }
    return { ...sty, ...style };
  }, [style, center, suppressHoriztonalPadding, suppressVerticallPadding, suppressPadding, paddingBottom, paddingTop]);

  return <Section style={styles}>{children}</Section>;
};

export default EmailSectionContent;
