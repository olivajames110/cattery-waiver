import React, { useMemo } from "react";
import { CloseRounded, SearchRounded } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { grey } from "@mui/material/colors";

const SearchInput = ({
  value, // can be string | null | undefined
  onChange,
  placeholder = "Search for...",
  fullWidth = false,
  sx = {},
  size = "medium",
  suppressBorder = false,
  suppressIcon = false,
  variant = "outlined", // "outlined" | "filled" | "text" | "paper" (custom)
  rounded = false,
}) => {
  // Ensure we never pass `null` to the TextField.
  // If value is null/undefined, use an empty string.
  const safeValue = value ?? "";

  // Build style object based on variant/rounded/suppressBorder.
  const styles = useMemo(() => {
    const styleObj = {
      ".MuiInputBase-root": {
        borderRadius: rounded ? "50px" : "4px",
        ".MuiSvgIcon-root": {
          color: grey[500],
        },
        ".MuiInputAdornment-root": {
          marginRight: "4px",
        },
      },
      fieldset: {},
      ...sx,
    };

    switch (variant) {
      case "text":
        // Minimal border, white background
        styleObj[".MuiInputBase-root"].background = "transparent";
        styleObj[".MuiInputBase-root"].paddingLeft = "0";
        // styleObj[".MuiInputAdornment-root"].color = grey[500];
        // styleObj[".MuiInputBase-root"].background = "#ffffff";
        styleObj.fieldset.border = "none";
        break;
      case "paper":
        // "Paper" style with custom border
        styleObj[".MuiInputBase-root"].background = "transparent";
        // styleObj[".MuiInputBase-root"].background = "#ffffff";
        styleObj[".MuiInputBase-root"].border = "1px solid rgb(223, 226, 231)";
        styleObj.fieldset.border = "none";
        break;
      case "filled":
        // Filled style
        styleObj[".MuiInputBase-root"].background = "#f2f5f7";
        styleObj.fieldset.border = "none";
        break;
      case "outlined":
      default:
        // Outlined style, optionally suppress border
        styleObj.fieldset.border = suppressBorder
          ? "none"
          : "1px solid #cfd8dc";
        break;
    }

    return styleObj;
  }, [sx, variant, rounded, suppressBorder]);

  return (
    <TextField
      value={safeValue}
      onChange={(e) => onChange(e.target.value)}
      sx={styles}
      placeholder={placeholder}
      fullWidth={fullWidth}
      size={size}
      InputProps={{
        startAdornment: !suppressIcon && (
          <InputAdornment position="start">
            <SearchRounded />
          </InputAdornment>
        ),
        endAdornment: safeValue ? (
          <IconButton size="small" onClick={() => onChange("")}>
            <CloseRounded />
          </IconButton>
        ) : null,
      }}
    />
  );
};

export default SearchInput;

// import React, { useMemo } from "react";
// import { CloseRounded, SearchRounded } from "@mui/icons-material";
// import { IconButton, InputAdornment, TextField } from "@mui/material";

// const SearchInput = ({
//   value, // can be string | null | undefined
//   onChange,
//   placeholder = "Search for...",
//   fullWidth = false,
//   sx = {},
//   size = "medium",
//   suppressBorder = false,
//   suppressIcon = false,
//   variant = "outlined", // "outlined" | "filled" | "text" | "paper" (custom)
//   rounded = false,
// }) => {
//   // Ensure we never pass `null` to the TextField.
//   // If value is null/undefined, use an empty string.
//   const safeValue = value ?? "";

//   // Build style object based on variant/rounded/suppressBorder.
//   const styles = useMemo(() => {
//     const styleObj = {
//       ".MuiInputBase-root": {
//         borderRadius: rounded ? "50px" : "4px",
//       },
//       fieldset: {},
//       ...sx,
//     };

//     switch (variant) {
//       case "text":
//         // Minimal border, white background
//         styleObj[".MuiInputBase-root"].background = "transparent";
//         // styleObj[".MuiInputBase-root"].background = "#ffffff";
//         styleObj.fieldset.border = "none";
//         break;
//       case "paper":
//         // "Paper" style with custom border
//         styleObj[".MuiInputBase-root"].background = "transparent";
//         // styleObj[".MuiInputBase-root"].background = "#ffffff";
//         styleObj[".MuiInputBase-root"].border = "1px solid rgb(223, 226, 231)";
//         styleObj.fieldset.border = "none";
//         break;
//       case "filled":
//         // Filled style
//         styleObj[".MuiInputBase-root"].background = "#f2f5f7";
//         styleObj.fieldset.border = "none";
//         break;
//       case "outlined":
//       default:
//         // Outlined style, optionally suppress border
//         styleObj.fieldset.border = suppressBorder
//           ? "none"
//           : "1px solid #cfd8dc";
//         break;
//     }

//     return styleObj;
//   }, [sx, variant, rounded, suppressBorder]);

//   return (
//     <TextField
//       value={safeValue}
//       onChange={(e) => onChange(e.target.value)}
//       sx={styles}
//       placeholder={placeholder}
//       fullWidth={fullWidth}
//       size={size}
//       InputProps={{
//         startAdornment: !suppressIcon && (
//           <InputAdornment position="start">
//             <SearchRounded />
//           </InputAdornment>
//         ),
//         endAdornment: safeValue ? (
//           <IconButton size="small" onClick={() => onChange("")}>
//             <CloseRounded />
//           </IconButton>
//         ) : null,
//       }}
//     />
//   );
// };

// export default SearchInput;
