import { Box, Grid2 } from "@mui/material";
import { isNil } from "lodash";
import React, { useMemo } from "react";
import Txt from "../typography/Txt";
import Flx from "../layout/Flx";

const DisplayDataRow = ({ label, icon, value, layout }) => {
  const cellColor = useMemo(() => "#33475b", []);
  const cellFontSize = useMemo(() => "12px", []);
  const separatorColor = useMemo(() => "#dde0e4", []);

  const sharedCellProps = {
    color: cellColor,
    fontSize: cellFontSize,

    value,
  };

  const cellIconProps = {
    icon,
    color: cellColor,
  };

  const cellLabelProps = {
    label,
    color: cellColor,
  };

  const cellValueProps = {
    value,
    color: cellColor,
  };

  if (layout === "row") {
    return (
      <Flx
        gap={1}
        ac
        className="display-data-row"
        sx={{
          borderBottom: `1px dashed ${separatorColor}`, //dividerLight
        }}
      >
        <RowIconCell {...cellIconProps} />
        <RowLabelCell {...cellLabelProps} />
        <RowValueCell {...cellValueProps} />
      </Flx>
    );
  }

  if (layout === "widget") {
    return (
      <Flx
        gap={1.5}
        ac
        className="display-data-row"
        sx={{
          p: 1,
          borderRadius: "8px",
          border: `1px dashed ${separatorColor}`, //dividerLight

          ".txt": {
            color: cellColor,
          },
        }}
      >
        <RowIconCell fontSize={"56px"} {...cellIconProps} />
        <Flx column>
          <RowLabelCell fontSize={"12px"} {...cellLabelProps} />
          <RowValueCell
            sx={{ lineHeight: "30px" }}
            fontSize={"24px"}
            {...cellValueProps}
          />
        </Flx>
      </Flx>
    );
  }

  return (
    <Flx
      gap={0.8}
      ac
      className="display-data-row"
      sx={
        {
          // borderBottom: `1px dashed ${separatorColor}`, //dividerLight
        }
      }
    >
      <RowIconCell fontSize={"16px"} {...cellIconProps} />
      <Flx ac gap={0.8}>
        <RowLabelCell {...cellLabelProps} />
        <RowValueCell {...cellValueProps} />
      </Flx>
    </Flx>
  );
};

const RowIconCell = ({ icon, color, fontSize }) => {
  if (isNil(icon)) {
    return null;
  }
  return (
    <Flx
      sx={{
        ".MuiSvgIcon-root": {
          fontSize: fontSize,
          color: color,
        },
      }}
    >
      {icon}
    </Flx>
  );
};

const RowLabelCell = ({ label, color, fontSize = "12px" }) => {
  if (isNil(label)) {
    return null;
  }
  return <Txt sx={{ color: color, fontSize: fontSize }}>{label}</Txt>;
};

const RowValueCell = ({ color, fontSize = "12px", value, sx }) => {
  return (
    <Txt sx={{ color, fontSize, fontWeight: "600 !important", ...sx }}>
      {value}
    </Txt>
  );
};

export default DisplayDataRow;
