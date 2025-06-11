import { isNil } from "lodash";
import React, { useMemo } from "react";
import RffForm from "../finalForm/RffForm";

const RffDataGroupOriginal = ({
  children,
  data,
  suppressLastRowBorder,
  initialValues,
  formSpy,
  width = "100%",
  row,
  sx = {},
}) => {
  // const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const styles = useMemo(() => {
    if (suppressLastRowBorder) {
      return {
        "&.editable-data-group": {
          ".editable-data-row": {
            "&:last-child": {
              borderBottom: "none",
            },
          },
        },
        ...sx,
      };
    }
    return sx;
  }, [suppressLastRowBorder, sx]);
  const init = useMemo(() => {
    if (isNil(initialValues)) {
      return data;
    }

    return initialValues;
  }, [initialValues, data]);

  return (
    <RffForm
      formSpy={formSpy}
      //
      sx={{ padding: 0, width: width, ...styles }}
      initialValues={init}
      suppressFooter
      flexDirection={row ? "row" : "column"}
      className="editable-data-group"
    >
      {children}
    </RffForm>
  );
};

export default RffDataGroupOriginal;
