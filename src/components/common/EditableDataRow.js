import { SaveOutlined, UndoOutlined } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Grid2,
  IconButton,
  Tooltip,
} from "@mui/material";
import { blue, red } from "@mui/material/colors";
import { isFunction, isNil } from "lodash";
import React, { useMemo, useState } from "react";
import { Form, FormSpy, useFormState } from "react-final-form";
import RffConditional from "../finalForm/shared/RffConditional";
import RffFieldComponentRenderer from "../finalForm/shared/RffFieldComponentRenderer";
import Flx from "../layout/Flx";
import Txt from "../typography/Txt";

const CELL_FONT_SIZE = 12; // Default font size for cell values
const SEPERATOR_COLOR = "#dde0e4"; // Default separator color

const EditableDataRow = ({
  label,
  name,
  type,
  options,
  suppressLabel,
  cellValueSize = 6,
  disabled,
  stacked,
  suppressBottomBorder,
  placeholder,
  grow = 0,
  data,
  onUpdateFn,
  condition,
}) => {
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
    onUpdateFn,
    grow,
    data,
  };

  // If no condition is provided, simply render the row.
  if (!condition) {
    return <RowContentWrapper {...rowProps} />;
  }

  // Pass the entire condition object to RffConditional
  return (
    <RffConditional condition={condition}>
      <RowContentWrapper {...rowProps} />
    </RffConditional>
  );
};

const EditableDataRowFormWrapper = ({
  initialValues = {},
  children,
  grow,
  onSubmit = () => {}, // Final Form requires an onSubmit function
}) => {
  return (
    <Form
      initialValues={initialValues}
      onSubmit={onSubmit}
      render={({ handleSubmit, form }) => (
        <Box
          component={"form"}
          sx={{ flexGrow: grow }}
          className="editable-field-root"
          onSubmit={handleSubmit}
        >
          {/* Track which fields are dirty, and call onValueChange if needed */}
          {/* <FormSpy
            subscription={{ values: true, dirtyFields: true }}
            onChange={(state) => {
              const { values, dirtyFields } = state;
              // If a field is dirty, you can notify the parent:
              if (onValueChange) {
                // For example, find all dirty fields and call onValueChange for each:
                Object.keys(dirtyFields || {}).forEach((fieldName) => {
                  if (dirtyFields[fieldName]) {
                    onValueChange({
                      field: fieldName,
                      newValue: values[fieldName],
                      // If you want, you could pass the original:
                      oldValue: initialValues[fieldName],
                    });
                  }
                });
              }
            }}
          /> */}
          {/* <RffFormSpy formSpy /> */}
          {React.Children.map(children, (child) => {
            if (!child) return child;
            // Pass 'form' and 'initialValues' down so the child can reset a specific field:
            return React.cloneElement(child, {
              form,
              initialValues,
            });
          })}
        </Box>
      )}
    />
  );
};

const RowContentWrapper = ({
  data,
  name,
  grow,
  onUpdateFn,
  initialValues,
  ...rest
}) => {
  // Build initialValues for this single field:
  const singleFieldInitialValues = useMemo(() => {
    if (isNil(data)) return {};
    // console.log("data", data);
    return { [name]: data[name] };
  }, [data, name]);

  return (
    <EditableDataRowFormWrapper
      grow={grow}
      initialValues={singleFieldInitialValues}
    >
      <RowContent name={name} data={data} onUpdateFn={onUpdateFn} {...rest} />
    </EditableDataRowFormWrapper>
  );
};

const RowContent = ({
  label,
  name,
  type,
  options,
  suppressLabel,
  cellValueSize,
  disabled,
  placeholder,
  stacked,
  onUpdateFn,
  loading,
  form,
  initialValues,
}) => {
  // We only care if *this field* is dirty. You can either:
  // 1) use <FormSpy subscription={{dirtyFields:true}}>, or
  // 2) check final form's field state. For simplicity, let's just use FormSpy again:
  const [isFieldDirty, setIsFieldDirty] = React.useState(false);
  const gridRowStyles = useMemo(() => {
    if (stacked) {
      return {};
    }
    return {
      borderBottom: `1px dashed ${SEPERATOR_COLOR}`,
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
  }, [stacked]);

  const handleResetField = React.useCallback(() => {
    form.change(name, initialValues[name]);
  }, [form, name, initialValues]);

  // Subscription for just this field:
  // (Alternatively, you could do a top-level FormSpy and then pass isDirty down.)
  return (
    <>
      <FormSpy
        subscription={{ values: true, dirtyFields: true }}
        onChange={({ dirtyFields, values }) => {
          const dirty = !!(dirtyFields && dirtyFields[name]);
          setIsFieldDirty(dirty);
        }}
      />

      {/* Layout logic: stacked vs. normal */}
      {stacked ? (
        <Flx column>
          <RowLabelCell
            label={label}
            type={type}
            stacked={stacked}
            cellValueSize={cellValueSize}
            suppressLabel={suppressLabel}
          />
          <RowValueCell
            name={name}
            type={type}
            options={options}
            disabled={disabled}
            placeholder={placeholder}
            stacked={stacked}
            cellValueSize={cellValueSize}
            loading={loading}
            onUpdateFn={onUpdateFn}
            fontSize={CELL_FONT_SIZE}
            isDirty={isFieldDirty}
            onResetField={handleResetField}
          />
        </Flx>
      ) : (
        <Grid2
          container
          spacing={2}
          className={`editable-data-row${stacked ? " stacked" : ""}`}
          sx={gridRowStyles}
        >
          <RowLabelCell
            label={label}
            type={type}
            stacked={stacked}
            cellValueSize={cellValueSize}
            suppressLabel={suppressLabel}
          />
          <RowValueCell
            name={name}
            type={type}
            options={options}
            disabled={disabled}
            placeholder={placeholder}
            fontSize={CELL_FONT_SIZE}
            cellValueSize={cellValueSize}
            stacked={stacked}
            loading={loading}
            isDirty={isFieldDirty}
            onUpdateFn={onUpdateFn}
            onResetField={handleResetField}
          />
        </Grid2>
      )}
    </>
  );
};

const RowLabelCell = ({
  label,
  suppressLabel,
  type,
  cellValueSize,
  stacked,
}) => {
  const cellLabelSize = stacked ? 12 : 12 - cellValueSize;
  const cellStyles = useMemo(() => {
    return type === "stringMultiline"
      ? { mt: 1 }
      : { display: "flex", alignItems: "center" };
  }, [type]);
  if (suppressLabel || isNil(label)) return null;
  if (stacked) {
    return (
      <Box className="editable-data-row--label" sx={cellStyles}>
        <Txt sx={{ color: "#33475b", fontSize: CELL_FONT_SIZE }}>{label}</Txt>
      </Box>
    );
  }

  return (
    <Grid2
      size={cellLabelSize}
      className="editable-data-row--label"
      sx={{ py: 0.8, ...cellStyles }}
    >
      <Txt sx={{ color: "#33475b", fontSize: CELL_FONT_SIZE }}>{label}</Txt>
    </Grid2>
  );
};

const RowValueCell = ({
  name,
  type,
  options,
  disabled,
  placeholder,
  stacked,
  cellValueSize,
  loading,
  isDirty,
  onUpdateFn,
  separatorColor,
  color,
  fontSize,
  onResetField,
}) => {
  const gridRootStyles = useMemo(() => {
    let defaultStyles = {
      position: "relative",
      display: "flex",
      flexGrow: 1,
      flexWrap: "wrap",
      gap: 0.5,
      justifyContent: "flex-end",
      fieldset: {
        borderColor: "transparent",
      },

      // alignItems: "center",
      // 1) Reset the forced font-weight on all .MuiButtonBase-root
      //    so that toggle buttons aren't always bold.
      ".MuiGrid-item": {
        flexGrow: 1,
      },
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

    if (!stacked) {
      defaultStyles.alignItems = "center";
    }
    if (stacked) {
      // Remove the dotted border if stacked:

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
        // padding: 0,
        minHeight: "unset !important",
        pl: 0.8,
        lineHeight: 1,
      };

      // If you want the adornment right up against the text:
      defaultStyles[".MuiInputAdornment-root"] = {
        marginLeft: 0,
      };

      // Remove padding from MuiInputBase-root and MuiButtonBase-root so that everything is flush
      defaultStyles[".MuiInputBase-root, .MuiButtonBase-root, input"] = {
        // ml: -0.8,

        ...defaultStyles[".MuiInputBase-root, .MuiButtonBase-root,"],
        // padding: 0,
      };
    }

    return defaultStyles;
  }, [separatorColor, stacked, color, fontSize]);

  const gridSize = stacked ? 12 : cellValueSize;

  const fieldProps = useMemo(() => {
    return {
      type,
      field: name,
      options,
      disabled,
      placeholder,
    };
  }, [type, name, options, disabled, placeholder]);

  const content = (
    <>
      <RffFieldComponentRenderer field={fieldProps} />
      {isDirty && (
        <UpdateFieldActions
          modified={isDirty}
          loading={loading}
          stacked={stacked}
          onReset={onResetField}
          onUpdateFn={onUpdateFn}
        />
      )}
    </>
  );

  if (stacked) {
    return (
      <Box
        className={`editable-data-row--value input-type--${type}`}
        sx={gridRootStyles}
      >
        {content}
      </Box>
    );
  }

  return (
    <Grid2
      size={gridSize}
      className={`editable-data-row--value input-type--${type}`}
      sx={gridRootStyles}
    >
      {content}
    </Grid2>
  );
};

const UpdateFieldActions = ({ onUpdateFn, modified, stacked, onReset }) => {
  const { values } = useFormState();
  const [loading, setLoading] = useState(false);

  const onSave = () => {
    const field = Object.keys(values).find((key) => values[key] !== undefined);
    const newValue = values[field];
    // console.log({ field, newValue, values });
    if (isFunction(onUpdateFn)) {
      setLoading(true);
      onUpdateFn({
        field,
        newValue,
        values,
        stopLoadingFn: () => {
          console.log("stopLoadingFn called");
          setLoading(false);
        },
      });
    }
  };
  if (!modified) return null;

  if (loading) {
    return (
      <UpdateFieldActionsdWrapper loading stacked={stacked}>
        <CircularProgress size={13} />
      </UpdateFieldActionsdWrapper>
    );
  }
  return (
    <UpdateFieldActionsdWrapper stacked={stacked}>
      <Tooltip title="Undo changes">
        <IconButton size="small" onClick={onReset} sx={{ background: red[50] }}>
          <UndoOutlined className="thin" color="error" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Save changes">
        <IconButton
          size="small"
          onClick={onSave}
          sx={{ background: "#e3f2fdcc" }}
        >
          <SaveOutlined className="thin" color="primary" />
        </IconButton>
      </Tooltip>
    </UpdateFieldActionsdWrapper>
  );
};

const UpdateFieldActionsdWrapper = ({ loading, children }) => {
  return (
    <Flx
      center
      sx={{
        // width: "70px",
        // height: "26px",
        background: loading ? blue[50] : "transparent",
        // background: "#80808012",
        borderRadius: "8px",
        minHeight: "26px",
        // mt: stacked ? 0.2 : 0.5,
        overflow: "hidden",
        // ml: 1,
        // mt: 0.2,
        // ml: stacked ? 0 : 1,
        // mt: stacked ? 0 : 0.5,
        // position: "absolute",
        flexWrap: "wrap",
        right: 0,

        // width: "100%",
        top: 0,

        flexBasis: "70px",
        // height: "26px",
        height: "max-content",

        zIndex: 1,
        // height: "100%",
        ".MuiButtonBase-root": {
          borderRadius: "0px",
          flexGrow: 1,
          // p: 0,
          px: 0.5,
          // background: grey[50],
          // height: "100%",
          svg: {
            fontSize: "16px !important",
          },
        },
      }}
    >
      {children}
    </Flx>
  );
  // return (
  //   <Flx
  //     sx={{
  //       // width: "70px",
  //       // height: "26px",
  //       // background: blue[50],
  //       background: "#80808012",
  //       borderRadius: "8px",
  //       // mt: stacked ? 0.2 : 0.5,
  //       // overflow: "hidden",
  //       // ml: 1,
  //       // mt: 0.2,
  //       // ml: stacked ? 0 : 1,
  //       // mt: stacked ? 0 : 0.5,
  //       position: "absolute",
  //       left: 0,
  //       // left: "-55px",
  //       width: "100%",
  //       top: 0,
  //       // top: "-50%",
  //       // top: "50%",
  //       // transform: "translateY(-50%)",
  //       // flexDirection: "column",
  //       // width: "70px",
  //       // height: "26px",
  //       zIndex: 1,
  //       height: "100%",
  //     }}
  //   >
  //     <Flx
  //       end
  //       sx={{
  //         // background: "#80808012",
  //         borderRadius: "8px",

  //         // overflow: "hidden",

  //         position: "absolute",

  //         top: "-25px",
  //         right: 0,

  //         ".MuiButtonBase-root": {
  //           borderRadius: "0px",
  //           // flexGrow: 1,

  //           // background: grey[50],
  //           height: "100%",
  //           svg: {
  //             fontSize: "18px !important",
  //           },
  //         },
  //       }}
  //     >
  //       {children}
  //       <ArrowDropDownRounded
  //         color="primary"
  //         sx={{
  //           position: "absolute",
  //           bottom: "-20px",
  //           fontSize: "32px !important",
  //         }}
  //       />
  //     </Flx>
  //   </Flx>
  // );
};

export default EditableDataRow;
