import { Img } from "@react-email/components";
import React from "react";

const EmailImage = ({ src, width, height, alt }) => {
  return <Img src={src} width={width} height={height} alt={alt} />;
};

export default EmailImage;
