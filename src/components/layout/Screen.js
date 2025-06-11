import React from "react";
import Flx from "./Flx";

const Screen = ({ children, id, sx }) => {
  return (
    <Flx id={id} column sx={{ height: "100%", ...sx }}>
      {children}
    </Flx>
  );
};

export default Screen;
