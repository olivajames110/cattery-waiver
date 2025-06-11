import { Box } from "@mui/material";
import { isNil } from "lodash";
import React, { useMemo } from "react";
import { Form } from "react-final-form";
import RffFormSpy from "./RffFormSpy";

const RffDataGroup = ({
  children,
  data,
  suppressLastRowBorder,
  initialValues,
  formSpy,
  width = "100%",
  row,
  grid = false,
  gap,
  id,
  column,

  grow = 1,

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
    <FormWrapper
      id={id}
      formSpy={formSpy}
      //
      sx={{ padding: 0, width: width, ...styles }}
      initialValues={init}
      suppressFooter
      gap={gap}
      row={row}
      className="editable-data-group"
    >
      {children}
    </FormWrapper>
  );
};

const FormWrapper = ({
  initialValues = {},
  children,
  grow,
  row,
  id,
  className = "",
  formSpy,
  sx,
  gap,
  onSubmit = () => {}, // Final Form requires an onSubmit function
}) => {
  return (
    <Form
      initialValues={initialValues}
      onSubmit={onSubmit}
      render={({ handleSubmit, form }) => (
        <Box
          component={"form"}
          id={id}
          sx={{
            display: "flex",
            flexDirection: row ? "row" : "column",
            flexGrow: grow,
            width: "100%",
            gap,
            ...sx,
          }}
          className={`editable-field-root ${className}`}
          onSubmit={handleSubmit}
        >
          {children}
          <RffFormSpy formSpy={formSpy} />
        </Box>
      )}
    />
  );
};

export default RffDataGroup;
