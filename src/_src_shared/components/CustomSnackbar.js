import { CheckRounded, CloseRounded, Error } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { grey, red } from "@mui/material/colors";
import { SnackbarContent } from "notistack";
import React, { forwardRef } from "react";
import Txt from "../../components/typography/Txt";

const CustomSnackbar = forwardRef((props, ref) => {
  const { message, closeSnackbar, variant } = props;

  const icon = {
    error: <Error sx={{ color: "white" }} />,
    success: <CheckRounded sx={{ color: "white" }} />,
  };

  const color = {
    error: red[500],
    success: "#008c5f",
  };

  return (
    <SnackbarContent
      ref={ref}
      role="alert"
      style={{ padding: 0, background: "none", boxShadow: "none" }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#ffffff",
          // backgroundColor: "#f1f6f4",
          borderRadius: "4px",
          boxShadow: 4,
          // padding: "8px 12px",
          minWidth: "300px",
        }}
      >
        <Box
          sx={{
            backgroundColor: color[variant],
            // backgroundColor: "#008c5f",
            padding: 2,
            borderRadius: "4px 0 0 4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon[variant]}
        </Box>
        <Box sx={{ p: 2, flexGrow: 1 }}>
          <Txt
            body2
            sx={{ color: "#33475b", fontWeight: 600, fontSize: "14px" }}
          >
            {message}
          </Txt>
        </Box>
        <IconButton
          size="small"
          onClick={() => closeSnackbar?.()}
          sx={{ color: grey[600], ml: 2, mr: 1 }}
        >
          <CloseRounded />
        </IconButton>
      </Box>
    </SnackbarContent>
  );
});

export default CustomSnackbar;
