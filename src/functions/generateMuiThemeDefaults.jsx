import { blueGrey, green, grey } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import { isNil } from "lodash";

const TAB_HEIGHT = "26px";
// const FONT_SIZE = 12.8;
// const FONT_SIZE = 13;
const FONT_SIZE = 12;
// const FONT_SIZE = 12.8;

// const TEXT_COLOR = "#232a31";
// const TEXT_COLOR = "#33475b";
const TEXT_COLOR = "#232a31";
// const TEXT_COLOR = "#33475b";
const INPUT_LABEL_COLOR = "#33475b";

const inputDefaultProps = {
  size: "small",
  variant: "outlined",
};

// Function to create theme based on the mode
const generateMuiThemeDefaults = ({ mode, primaryColor, secondaryColor }) => {
  return createTheme({
    palette: {
      mode: "light",
      primary: {
        main: isNil(primaryColor) ? "#6633cc" : primaryColor,
      },
      secondary: {
        main: "#062e6f",
        // main: "#656e76",
      },

      divider: "#dde1e7",
      // divider: "#bdc3c7",
      dividerLight: "#e5e7eb",
      separator: "#dde0e4",
      // dividerLight: blueGrey[100],
      background: {
        default: "#ffffff",
        secondary: "#fdfefe",
      },
      text: {
        primary: TEXT_COLOR,
        // primary: "rgba(0, 0, 0, 0.87)",
        secondary: "rgba(0, 0, 0, 0.6)",
        title: "#062e6f",
      },
      success: {
        main: green[800],
      },
    },

    typography: {
      fontFamily: "var(--primaryFont)",
      // fontFamily: `"Inter", serif;`,
      fontSize: FONT_SIZE,
      h1: {
        // fontSize: "48px",
        fontFamily: `"Lora", serif`,
        fontSize: "1.35rem",
        fontWeight: 700,
        // color: "var(--titleColor)",
      },
      h2: {
        // fontSize: "40px",
        fontSize: "1.125rem",
        // fontFamily: `"Lora", serif`,
        fontFamily: "var(--primaryFont)",
        fontWeight: 600,
        // color: "var(--titleColor)",
      },
      h3: {
        // fontSize: "32px",
        fontFamily: "var(--primaryFont)",
        // fontFamily: `"Lora", serif`,
        // color: "#062e6f",
        fontSize: "15px",
        // fontSize: "1rem",
        fontWeight: 500,
        // color: "var(--titleColor)",
      },
      h4: {
        // fontFamily: `"Lora", serif`,
        fontFamily: "var(--primaryFont)",
        fontSize: "0.875rem",

        fontWeight: 400,
        // color: "var(--titleColor)",
      },
      h5: {
        fontSize: "0.75rem",
        fontWeight: 400,
      },
      h6: {
        fontSize: "0.625rem",
        fontWeight: 400,
      },
    },
    components: {
      MuiInputBase: {
        defaultProps: { ...inputDefaultProps },
      },

      // MuiTypography: {
      //   styleOverrides: {
      //     root: {
      //       lineHeight: 1.5,
      //     },
      //   },
      // },

      MuiTooltip: {
        defaultProps: {
          placement: "top",
          arrow: true,
          disableInteractive: true,
        },
        styleOverrides: {
          tooltip: {
            fontSize: "12px",
            padding: "8px",
            // background: TEXT_COLOR
          },
        },
      },
      MuiInputAdornment: {
        styleOverrides: {
          root: {
            color: TEXT_COLOR, // White adornment in dark mode
            "& .MuiSvgIcon-root": {
              fontSize: "15px",
              // fontSize: '1.5rem',
              color: TEXT_COLOR, // White adornment in dark mode
              // color: '#1976d2',
            },
            input: {
              "&::placeholder": {
                fontWeight: "400 !important",
                // You can also change color, font-size, etc. here
              },
            },
          },
        },
      },

      MuiTextField: {
        defaultProps: { ...inputDefaultProps },
      },

      MuiFormHelperText: {
        styleOverrides: {
          root: {
            fontSize: "13px",
            opacity: 0.85,
            marginLeft: "0px",
            "&.Mui-error": {
              // styles you want specifically when error = true
              // color: "red",           // or any color
              marginLeft: "0px", // override any left margin if needed
              // fontWeight: 600,        // example of another style
            },
          },
        },
      },

      MuiFormLabel: {
        styleOverrides: {
          root: {
            // fontSize: "12px",
            fontSize: "13px",
            color: INPUT_LABEL_COLOR,
          },
        },
      },

      MuiCard: {
        variants: [
          // Existing custom variant
          {
            props: { suppressPadding: true },
            style: {
              padding: 0,
            },
          },
          // New outline variant
          {
            props: { variant: "outlined" },
            style: ({ theme }) => ({
              border: `1px solid ${theme.palette.dividerLight}`,
              // boxShadow: "#7f8f9f4d 0px 4px 8px",
              // boxShadow: "#7f8f9f4d 0px 4px 8px",
              boxShadow: "none",
            }),
          },
        ],
        styleOverrides: {
          root: ({ theme }) => ({
            background: theme.palette.background.default,
            padding: "14px",
            borderRadius: "8px",
            // borderRadius: "4px",
            // boxShadow: "var(--bs)",
            // boxShadow: "rgb(0 0 0 / 10%) 0px 1px 2px",
            boxShadow:
              "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
            // boxShadow:
            //   "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
            // boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px;",
            border: `1px solid #e1e4e869`, // 1px solid #e5e7eb
            // border: `1px solid #e1e4e8`, // 1px solid #e5e7eb
            // border: `1px solid ${theme.palette.dividerLight}`, // 1px solid #e5e7eb
            overflow: "hidden",
          }),
        },
      },

      MuiTabs: {
        styleOverrides: {
          root: {
            minHeight: TAB_HEIGHT,
          },
        },
      },

      MuiToggleButton: {
        styleOverrides: {
          root: {
            // padding: "2px 8px",
            textTransform: "capitalize",
          },
        },
      },

      MuiButton: {
        variants: [
          {
            props: { size: "xs" },
            style: {
              padding: "2px 8px",
              // padding: "4px 8px",
              // fontSize: "12px",
              minWidth: "30px",
            },
          },
          {
            props: { variant: "contained", color: "gray" },
            style: {
              backgroundColor: "#f2f2f2",
              "&:hover": {
                backgroundColor: "#cfcfcf",
              },
            },
          },
          {
            props: { variant: "outlined", color: "gray" },
            style: {
              borderColor: grey[500],
              color: grey[600],
              "&:hover": {
                borderColor: "#707070",
                backgroundColor: "rgba(158, 158, 158, 0.04)",
              },
            },
          },
          {
            props: { variant: "text", color: "gray" },
            style: {
              color: "#9e9e9e",
              "&:hover": {
                backgroundColor: "rgba(158, 158, 158, 0.04)",
              },
            },
          },
        ],
        defaultProps: {
          variant: "contained",
          color: "primary",
          size: "small",
        },
        styleOverrides: {
          root: {
            flexShrink: 0,
            fontWeight: 500,
            // fontWeight: 700,
            textTransform: "initial",
            boxShadow: "none",
          },
        },
      },
    },
  });
};

export default generateMuiThemeDefaults;
