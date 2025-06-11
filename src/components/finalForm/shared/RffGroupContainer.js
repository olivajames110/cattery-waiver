import React from "react";
import Flx from "../../layout/Flx";

const RffGroupContainer = ({ children, flexDirection, suppressFooter }) => {
  return (
    <Flx
      // column={flexDirection}
      fw
      sx={{
        flexDirection: flexDirection,
        ".rff-group": {
          mb: 8,
        },
      }}
    >
      {children}
    </Flx>
  );
};

export default RffGroupContainer;
