import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { useState } from "react";
import Flx from "../../layout/Flx";

const EmailEditingWrapper = ({
  data,
  onDelete,
  onSelect,
  editingMode,
  children,
}) => {
  const [hover, setHover] = useState(false);

  const onDeleteClick = () => {
    onDelete(data);
  };
  const onEditClick = () => {
    onSelect(data);
  };

  if (editingMode) {
    return (
      <Box
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={hover ? "hover" : ""}
        sx={{
          position: "relative",
          "&.hover": {
            "&:after": {
              content: '" "',
              background: "#eeeeee30",
              border: "1px solid #eeeeee",
              borderRadius: "8px",
              position: "absolute",
              left: "-4px",
              width: "calc(100% + 8px)",
              // left: "0px",
              // top: "0px",
              top: "-5px",
              // width: "calc(100% - 2px)",
              // height: "100%",
              height: "calc(100% + 10px)",
              // cursor: "pointer",
            },
            ".template-edit-button": {
              // opacity: 1,
              background: grey[50],
              // background: "#eeeeee30",
              borderRadius: "8px",

              border: "1px solid #eeeeee",
              svg: {
                fontSize: "16px !important",
              },
            },
          },
          // "&:hover": {
          //   ".template-edit-button": {
          //     opacity: 1,
          //   },
          //   "&:after": {
          //     content: '" "',
          //     background: "#eeeeee30",
          //     borderRadius: "8px",
          //     position: "absolute",
          //     left: "0px",
          //     // top: "0px",
          //     top: "-5px",
          //     border: "1px solid #eeeeee",
          //     width: "calc(100% - 2px)",
          //     // height: "100%",
          //     height: "calc(100% + 10px)",
          //     // cursor: "pointer",
          //   },
          // },
        }}
      >
        {children}
        {hover ? (
          <Flx
            sx={{
              // opacity: localEdit ? 1 : 0,
              position: "absolute",
              right: "5px",
              gap: "4px",
              zIndex: 1234,
              // top: "50%",
              top: "0px",
              // transform: "translateY(-50%)",
              // top: "0px",
              // top: "-155%",
              // top: "-4px",
              //
            }}
          >
            <IconButton
              className="template-edit-button"
              color="primary"
              size="small"
              onClick={onEditClick}
            >
              <EditOutlined />
            </IconButton>
            <IconButton
              className="template-edit-button"
              color="primary"
              size="small"
              onClick={onDeleteClick}
            >
              <DeleteOutline />
            </IconButton>
          </Flx>
        ) : null}
      </Box>
    );
  }
  return children;
};

export default EmailEditingWrapper;
