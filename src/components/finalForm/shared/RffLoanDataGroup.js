import React from "react";
import { useSelector } from "react-redux";
import RffDataGroup from "./RffDataGroup";

const RffLoanDataGroup = ({ children, gap, formSpy, row, id, sx }) => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);

  return (
    <RffDataGroup
      id={id}
      row={row}
      gap={gap}
      formSpy={formSpy}
      sx={sx}
      data={loanDrilldown}
    >
      {children}
    </RffDataGroup>
  );
};
export default RffLoanDataGroup;
