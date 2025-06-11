// LoanNumberCellRenderer.jsx
import React, { useState, useEffect, useMemo, forwardRef } from "react";
import { Autocomplete, Box, TextField } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { isString, isEmpty, isNil, isArray } from "lodash";

// AG Grid cell renderer for loan number selection
export default forwardRef((props, ref) => {
  const { value, column, data, node, api, columnApi, context } = props;

  // Get field name from column definition (or pass it via params)
  const fieldName = column.colId;

  // Get the column params (could include label, required, etc)
  const colDef = column.getColDef();
  const label = colDef.headerName || fieldName;
  const required = colDef.cellRendererParams?.required || false;
  const size = colDef.cellRendererParams?.size || "small"; // Default to small for grid

  const [currentValue, setCurrentValue] = useState(value);

  // Get Redux dispatch and loanPipeline from store
  const dispatch = useDispatch();
  const loanPipeline = useSelector((state) => state?.loanPipeline);

  // Function to fetch loan pipeline if not available
  // This would need to be provided via context or imported directly
  const getUserPipeline =
    colDef.cellRendererParams?.getUserPipeline || context?.getUserPipeline;
  const loanPipelineSet =
    colDef.cellRendererParams?.loanPipelineSet || context?.loanPipelineSet;

  // Format loan options similar to your original code
  const loanNumberOptions = useMemo(() => {
    if (!isArray(loanPipeline)) {
      // Only fetch if the fetch function and action creator are available
      if (getUserPipeline && loanPipelineSet) {
        getUserPipeline({
          onSuccessFn: (pipeline) => {
            dispatch(loanPipelineSet(pipeline));
            return pipeline;
          },
          onFailFn: () => {
            return [];
          },
        });
      }
      return [];
    }

    return loanPipeline?.map((l) => {
      return {
        // label: l?.loanNumber,
        // optionLabel: `<${l?.loanNumber}> ${l?.loanName}`,
        label: `${l?.loanNumber} (${l?.loanName})`,
        value: l?._id,
      };
    });
  }, [loanPipeline, getUserPipeline, loanPipelineSet, dispatch]);

  // Find the selected option object
  const selectedOption = useMemo(() => {
    return (
      loanNumberOptions?.find((option) =>
        isString(option)
          ? option === currentValue
          : option.value === currentValue
      ) || null
    );
  }, [currentValue, loanNumberOptions]);

  // Apply similar styling as your original component
  const styles = useMemo(() => {
    return {
      width: "100%",
      height: "100%",
      ".MuiAutocomplete-endAdornment": {
        marginRight: "0px",
      },
      // Fade out the color if there's no selected option
      "& .MuiInputBase-input": {
        color: selectedOption ? "inherit" : "rgba(0, 0, 0, 0.3)",
      },
    };
  }, [selectedOption]);

  // For placeholders
  const emptyPlacholderValue = "Start Typing...";
  const populatedPlacholderValue = "Start Typing...";

  // Update the grid cell value when selection changes
  const handleChange = (newValue) => {
    let updatedValue;

    if (isString(newValue)) {
      updatedValue = newValue;
    } else {
      // If the user selects an object, take its 'value' field
      updatedValue = newValue?.value;
    }

    setCurrentValue(updatedValue);

    // Update the grid data
    const updatedData = { ...data };
    updatedData[fieldName] = updatedValue;

    // This tells AG Grid the data has been updated
    node.setData(updatedData);
  };

  // This effect syncs the component with external value changes in the grid
  useEffect(() => {
    if (value !== currentValue) {
      setCurrentValue(value);
    }
  }, [value]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        // padding: "2px",
      }}
    >
      <Autocomplete
        loading={isNil(loanNumberOptions) || isEmpty(loanNumberOptions)}
        value={selectedOption}
        onChange={(event, newValue) => handleChange(newValue)}
        isOptionEqualToValue={(option, val) =>
          isString(option) ? option === val : option.value === val
        }
        fullWidth
        size={size}
        options={loanNumberOptions}
        sx={styles}
        // For displaying the selected text in the input
        getOptionLabel={(option) => {
          if (isString(option)) {
            return option;
          }
          // Ensure we convert the label to a string
          return option.label !== undefined
            ? String(option.label)
            : String(option.value ?? "");
        }}
        // Display in the dropdown
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;

          if (isString(option)) {
            return (
              <Box key={option} {...optionProps}>
                {option}
              </Box>
            );
          }

          // If it's an object, prefer .optionLabel, else fallback
          const displayText =
            option.optionLabel || option.label || String(option.value ?? "");

          return (
            <Box key={option.value} sx={{ fontSize: ".7rem" }} {...optionProps}>
              {displayText}
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            fullWidth
            ref={params.InputProps.ref}
            placeholder={
              isEmpty(currentValue)
                ? emptyPlacholderValue
                : populatedPlacholderValue
            }
            {...params}
            endAdornment={params.InputProps.endAdornment}
            inputProps={{
              ...params.inputProps,
            }}
          />
        )}
      />
    </Box>
  );
});
