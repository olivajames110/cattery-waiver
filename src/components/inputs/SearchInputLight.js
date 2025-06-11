import React, { useMemo } from "react";
import SearchInput from "./SearchInput";

const SearchInputLight = ({
  value,
  onChange,
  placeholder = "Search in table...",
  fullWidth = false,
  sx,
}) => {
  const styles = useMemo(() => {
    let baseStyles = {
      // maxWidth: "400px",
      flexGrow: 1,
      width: "auto",
      // flexShrink: 1,
      // svg: { fontSize: "16px" },
      // input: {
      //   flexGrow: 1,
      //   fontSize: "14px",
      //   pl: 0,
      //   //
      //   // pb: 0.5,
      //   // pt: 0.5,
      // },
      ...sx,
    };

    return { ...baseStyles };
  }, [sx]);

  // const styles = useMemo(() => {
  //   let baseStyles = {
  //     // maxWidth: "400px",
  //     flexGrow: 1,
  //     flexShrink: 0,
  //     svg: { fontSize: "16px" },
  //     // input: { flexGrow: 1, fontSize: "14px" },
  //     ...sx,
  //   };

  //   let dynamicStyles = {};

  //   if (shape === "round") {
  //     dynamicStyles.borderRadius = "50px";
  //   }
  //   return { ...baseStyles, ...dynamicStyles, ...sx };
  // }, [shape, sx]);
  return (
    <SearchInput
      variant="text"
      value={value}
      onChange={onChange}
      size="small"
      fullWidth={fullWidth}
      placeholder={placeholder}
      sx={styles}
    />
  );
};

export default SearchInputLight;
