import { Box, CircularProgress, Grid2 } from "@mui/material";
import { isNil } from "lodash";
import React, { useMemo, useRef } from "react";
import RffConditional from "../finalForm/shared/RffConditional";
import RffFieldComponentRenderer from "../finalForm/shared/RffFieldComponentRenderer";
import Txt from "../typography/Txt";
import Flx from "../layout/Flx";
import { Form, FormSpy } from "react-final-form";

const EditableDataRowFormWrapper = ({
  onValueChange,
  initialValues = {},
  children,
  type,
  onSubmit = () => {}, // Final Form requires an onSubmit function
}) => {
  // console.log("initialValues", initialValues);

  // Use a ref to track previous values
  const prevValuesRef = useRef(initialValues);

  return (
    <Form
      initialValues={initialValues}
      onSubmit={onSubmit}
      render={({ handleSubmit, form }) => (
        <form onSubmit={handleSubmit}>
          {/* Watch for value changes with FormSpy */}
          <FormSpy
            subscription={{ values: true }}
            onChange={(state) => {
              if (onValueChange) {
                // Get the changed field by comparing the previous values with current values
                const newValues = state.values;
                const prevValues = prevValuesRef.current;

                // Find which field changed by comparing old and new values
                const changedFields = Object.keys(newValues).filter(
                  (field) => newValues[field] !== prevValues[field]
                );

                if (changedFields.length > 0) {
                  const field = changedFields[0]; // Assuming one field changed at a time
                  const newValue = newValues[field];
                  const oldValue = prevValues[field];

                  // Call onValueChange with the enhanced information
                  // onValueChange({ field, newValue, oldValue }, form);

                  // Update the previous values ref
                  prevValuesRef.current = { ...newValues };
                }
              }
            }}
          />

          {children}
        </form>
      )}
    />
  );
};

// Function to enhance a field with blur event handling for text inputs
// Function to enhance a field with blur event handling for text inputs
// Function to enhance a field with blur event handling for text inputs
const enhanceFieldWithBlurHandler = (field, onFieldUpdate) => {
  // Only add blur handling for text input types
  const textInputTypes = [
    "phone",
    "email",
    "ssn",
    "password",
    "number",
    "selectMultiple",
    "dollar",
    "percent",
    "number",
    "integer",
    "float",
    "date",
    "stringMultiline",
    "text",
    "string",
  ];

  if (textInputTypes.includes(field.type) || isNil(field.type)) {
    return {
      ...field,
      // This onBlur function will be passed to RffFieldComponentRenderer
      // which passes it to components like RffTextField
      onBlur: (event) => {
        // Check if this is a DOM event (from Material-UI TextField)
        if (event && event.target) {
          const currentValue = event.target.value;

          // If the field has a custom onBlur, call it
          if (field.onBlur) {
            field.onBlur({
              field: field.field,
              newValue: currentValue,
              oldValue: field.initialValue || "", // Fallback for initialValue
            });
          }

          // If there's a field update handler and the value has changed
          if (onFieldUpdate && currentValue !== (field.initialValue || "")) {
            onFieldUpdate({
              field: field.field,
              newValue: currentValue,
              oldValue: field.initialValue || "", // Fallback for initialValue
            });
          }
        }
        // This is for handling if React Final Form passes field props directly
        else if (event && typeof event === "object" && event.input) {
          const { input } = event;

          if (field.onBlur) {
            field.onBlur({
              field: field.field,
              newValue: input.value,
              oldValue: input.initialValue,
            });
          }

          if (onFieldUpdate && input.value !== input.initialValue) {
            onFieldUpdate({
              field: field.field,
              newValue: input.value,
              oldValue: input.initialValue,
            });
          }
        }
        // For fallback cases where we might receive other event structures
        else {
          console.log("Unhandled onBlur event structure:", event);
        }
      },
    };
  }

  return field;
};

const EditableDataRowGPT = ({
  label,
  name,
  type,
  options,
  suppressLabel,
  cellValueSize = 6,
  disabled = true,
  stacked,
  suppressBottomBorder,
  placeholder,
  data,
  loading,
  onFieldUpdate,
  condition,
}) => {
  // Prepare the field structure for RffFieldComponentRenderer.

  // The content of the row as a separate node.

  // If no condition is provided, simply render the row.
  const rowProps = {
    type,
    name,
    options,
    label,
    suppressLabel,
    cellValueSize,
    disabled,
    placeholder,
    suppressBottomBorder,
    stacked,
    onFieldUpdate,
    data,
  };
  if (!condition) {
    return <RowContent {...rowProps} />;
  }

  // If a condition is provided, wrap the row content in <RffConditional>.
  const {
    field: conditionField,
    operator,
    value,
    rules,
    operatorForMultiple,
    testing,
  } = condition;

  return (
    <RffConditional
      field={conditionField}
      operator={operator}
      value={value}
      rules={rules}
      operatorForMultiple={operatorForMultiple}
      testing={testing}
    >
      <RowContent {...rowProps} />
    </RffConditional>
  );
};

const RowContent = ({
  type,
  name,
  options,
  label,
  cellValueSize,
  suppressLabel,
  disabled,
  stacked,
  onFieldUpdate,
  data,
  placeholder,
  loading,
}) => {
  const field = useMemo(
    () => ({
      type,
      field: name,
      options,
      disabled,
      placeholder,
      // fullWidth: false,
      toggleSize: "xs",
      suppressGrid: stacked,
    }),
    [type, name, options, disabled, placeholder, stacked]
  );

  // Enhance the field with blur handling for text inputs
  const enhancedField = useMemo(
    () => enhanceFieldWithBlurHandler(field, onFieldUpdate),
    [field, onFieldUpdate]
  );

  const cellColor = useMemo(() => "#33475b", []);
  const cellFontSize = useMemo(() => "12px", []);
  const separatorColor = useMemo(() => "#dde0e4", []);

  const sharedCellProps = {
    color: cellColor,
    fontSize: cellFontSize,
    cellValueSize,
    suppressLabel,
    stacked,
  };

  const rowStyles = useMemo(() => {
    if (stacked) {
      return {};
    }
    return {
      borderBottom: `1px dashed ${separatorColor}`,
      ".input-type--booleanCheckbox": {
        padding: "0 14px",
      },
      ".input-type--booleanToggle , .input-type--selectToggle": {
        padding: "8.5px 10px",
        ".MuiToggleButtonGroup-root": {
          mt: 0,
        },
      },
    };
  }, [separatorColor, stacked]);

  const rowSpacing = useMemo(() => {
    if (stacked) {
      return 0;
    }
    return 2;
  }, [stacked]);

  const rowClassName = useMemo(() => {
    const classes = ["editable-data-row"];
    if (stacked) {
      classes.push("stacked");
    }
    return classes.join(" ");
  }, [stacked]);

  const initialValues = useMemo(() => {
    let init = {};
    // console.log("field", { field, data });

    if (isNil(data)) {
      return null;
    }

    const fieldName = field?.name || field?.field;
    init[fieldName] = data[fieldName];
    return init;
  }, [data, field]);

  if (stacked) {
    return (
      <EditableDataRowFormWrapper
        initialValues={initialValues}
        onValueChange={onFieldUpdate}
      >
        <Flx column>
          <RowLabelCell label={label} type={type} {...sharedCellProps} />
          <RowValueCell
            type={type}
            field={enhancedField}
            separatorColor={separatorColor}
            {...sharedCellProps}
          />
        </Flx>
      </EditableDataRowFormWrapper>
    );
  }

  return (
    <EditableDataRowFormWrapper
      initialValues={initialValues}
      onValueChange={onFieldUpdate}
    >
      <Grid2
        container
        spacing={rowSpacing}
        className={rowClassName}
        sx={rowStyles}
      >
        <RowLabelCell label={label} type={type} {...sharedCellProps} />
        <RowValueCell
          type={type}
          field={enhancedField}
          separatorColor={separatorColor}
          loading={loading}
          {...sharedCellProps}
        />
      </Grid2>
    </EditableDataRowFormWrapper>
  );
};

const RowLabelCell = ({
  label,
  color,
  fontSize,
  suppressLabel,
  cellValueSize,
  type,
  stacked,
}) => {
  const cellStyles = useMemo(() => {
    if (type === "stringMultiline") {
      return { mt: 1 };
    }
    return {
      display: "flex",
      alignItems: "center",
    };
  }, [type]);

  const cellLabelSize = useMemo(() => {
    if (stacked) {
      return 12;
    }
    return 12 - cellValueSize;
  }, [stacked, cellValueSize]);

  if (suppressLabel || isNil(label)) {
    return null;
  }

  if (stacked) {
    return (
      <Box className="editable-data-row--label" sx={cellStyles}>
        <Txt sx={{ color: color, fontSize: fontSize }}>{label}</Txt>
      </Box>
    );
  }

  return (
    <Grid2
      className="editable-data-row--label"
      sx={cellStyles}
      size={cellLabelSize}
    >
      <Txt sx={{ color: color, fontSize: fontSize }}>{label}</Txt>
    </Grid2>
  );
};

const RowValueCell = ({
  type,
  color,
  fontSize,
  field,
  suppressLabel,
  cellValueSize,
  separatorColor,
  stacked,
  loading,
}) => {
  const cellValueStyles = useMemo(() => {
    let defaultStyles = {
      position: "relative",
      justifyContent: "flex-end",
      fieldset: {
        borderColor: "transparent",
      },

      // 1) Reset the forced font-weight on all .MuiButtonBase-root
      //    so that toggle buttons aren't always bold.
      ".MuiInputBase-root, .MuiButtonBase-root": {
        fontWeight: 600,
        "&:not(.MuiCheckbox-root)": {
          color,
          fontSize,
          // Remove the universal "600 !important" font-weight here
          fontWeight: 600,
          // fontWeight: "normal !important",

          // For TextField placeholders:
          "& input::placeholder": {
            // fontWeight: 600,
            fontWeight: "normal !important",
          },

          // For Select placeholders (when value=""):
          "& .MuiSelect-select[value='']": {
            fontWeight: 600,
            // fontWeight: "normal !important",
          },

          // Select placeholder
          "& .MuiSelect-select": {
            span: {
              // fontWeight: 600,
              fontWeight: "normal !important",
            },
          },

          "& input::placeholder, & textarea::placeholder": {
            // fontWeight: 600,
            fontWeight: "normal !important",
          },
        },

        // 2) Make disabled fields appear the same color but keep placeholders normal
        "&.Mui-disabled": {
          fontWeight: "600 !important",

          input: {
            "-webkit-text-fill-color": `${color} !important`,
          },
          "& fieldset": {
            borderColor: "transparent",
          },
          "& input::placeholder, & textarea::placeholder": {
            fontWeight: 600,
            // fontWeight: "normal !important",
          },
          "& .MuiSelect-select[value='']": {
            fontWeight: 600,
            // fontWeight: "normal !important",
          },
        },
      },

      // 3) Specifically target toggle buttons:
      ".MuiToggleButton-root": {
        // Normal weight for non-selected
        // fontWeight: 600,
        fontWeight: "normal !important",

        // Bold only when selected
        "&.Mui-selected": {
          fontWeight: "600 !important",
        },
      },
    };

    // if (!stacked) {
    //   defaultStyles.borderLeft = `1px dotted ${separatorColor}`;
    // }

    if (stacked) {
      // Remove the dotted border if stacked:
      defaultStyles.borderLeft = "none";

      // Allow the container itself to shrink to fit content:
      defaultStyles.display = "inline-flex";
      defaultStyles.whiteSpace = "nowrap";
      defaultStyles.width = "fit-content";

      // Let the FormControl shrink to its content:
      defaultStyles[".MuiFormControl-root"] = {
        width: "fit-content",
      };

      // OutlinedInput root typically has default width/padding:
      defaultStyles[".MuiOutlinedInput-root"] = {
        width: "auto",
        paddingRight: 0,
      };

      // The actual text input part: remove min-width and padding
      defaultStyles[".MuiOutlinedInput-input"] = {
        width: "auto",
        minWidth: 0,
        padding: 0,
        lineHeight: 1,
      };

      // If you want the adornment right up against the text:
      defaultStyles[".MuiInputAdornment-root"] = {
        marginLeft: 0,
      };

      // Remove padding from MuiInputBase-root and MuiButtonBase-root so that everything is flush
      defaultStyles[".MuiInputBase-root, .MuiButtonBase-root, input"] = {
        ...defaultStyles[".MuiInputBase-root, .MuiButtonBase-root,"],
        padding: 0,
      };
    }

    return defaultStyles;
  }, [separatorColor, stacked, color, fontSize]);

  const gridSize = useMemo(() => {
    if (stacked || suppressLabel) {
      return 12;
    }
    return cellValueSize;
  }, [stacked, suppressLabel, cellValueSize]);

  if (stacked) {
    return (
      <Box
        className={`editable-data-row--value input-type--${type}`}
        sx={cellValueStyles}
      >
        <RffFieldComponentRenderer field={field} />
      </Box>
    );
  }
  return (
    <Grid2
      className={`editable-data-row--value input-type--${type}`}
      sx={cellValueStyles}
      size={gridSize}
    >
      <RffFieldComponentRenderer field={field} />
      {loading ? (
        <CircularProgress
          size={13}
          sx={{ position: "absolute", right: "11px", top: "11px" }}
        />
      ) : null}
    </Grid2>
  );
};

export default EditableDataRowGPT;
