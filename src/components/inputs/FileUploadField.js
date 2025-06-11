import React, { useState, useRef } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  Typography,
  useTheme,
} from "@mui/material";
import { CloseRounded, FileUploadOutlined } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import Txt from "../typography/Txt";
import Flx from "../layout/Flx";
import { v4 as uuidv4 } from "uuid";
import isFunction from "lodash/isFunction";

const FileUploadField = ({
  label,
  height = "auto",
  sx,
  hideUploadButton,
  uploadText = "Drag & drop or click to select files",
  suppressUploadButton,
  includeFileList,
  suppressLabel,
  uploadTextStartContent,
  uploadTextEndContent,
  onUpload,
  background = "transparent",
  onFilesAdded,
  docGroup,
  borderSize = 2,
  loading,
  minHeight = "110px",
  docType,
  suppressFileList,
}) => {
  const theme = useTheme();
  const dragCounter = useRef(0);
  const [allFiles, setAllFiles] = useState([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // keep a running count of enters/leaves to avoid flicker
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (dragCounter.current === 1) {
      setIsDraggingOver(true);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDraggingOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDraggingOver(false);
    if (!e.dataTransfer.files) return;
    handleOnFilesAdded(Array.from(e.dataTransfer.files));
  };

  const handleOnFilesAdded = (newRawFiles) => {
    const newFiles = newRawFiles.map((file) => ({
      id: uuidv4(),
      file,
      name: file.name,
      file_display_name: file.name,
      docGroup: docGroup || undefined,
      docType: docType || undefined,
    }));
    if (isFunction(onUpload)) onUpload(newFiles);
    if (isFunction(onFilesAdded)) onFilesAdded(newFiles);
    setAllFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileChange = (e) => {
    if (!e.target.files) return;
    handleOnFilesAdded(Array.from(e.target.files));
  };

  const displayedFiles = allFiles.filter((f) => {
    const matchGroup = docGroup ? f.docGroup === docGroup : !f.docGroup;
    const matchType = docType ? f.docType === docType : !f.docType;
    return matchGroup && matchType;
  });

  const onFileDelete = (idx) => {
    const toRemove = displayedFiles[idx];
    setAllFiles((prev) => prev.filter((f) => f !== toRemove));
  };

  const inputId = `file-input-${docGroup || "noGroup"}-${docType || "noType"}`;
  const openPicker = () => document.getElementById(inputId)?.click();

  return (
    <>
      <Box
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openPicker}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
          cursor: "pointer",
          transition: "all 100ms ease-in-out",
          height,
          minHeight,
          p: suppressUploadButton ? 1 : 4,
          gap: 1,
          borderRadius: "4px",
          background: isDraggingOver
            ? `${theme.palette.primary.light}20`
            : background,
          // spread user overrides first...
          ...(sx || {}),
          // ...then override border last when dragging
          border: isDraggingOver
            ? `${borderSize}px dashed ${theme.palette.primary.main}`
            : `${borderSize}px dashed ${grey[300]}`,
          // color drives children
          color: isDraggingOver ? theme.palette.primary.main : grey[600],
        }}
      >
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <>
            {!hideUploadButton && (
              <FileUploadOutlined
                sx={{ opacity: isDraggingOver ? 0.8 : 0.55 }}
              />
            )}

            {!suppressLabel && (
              <Flx ac>
                {uploadTextStartContent}
                <Txt
                  className="upload-text-label"
                  sx={{ opacity: isDraggingOver ? 0.9 : 0.7 }}
                  body2
                >
                  {uploadText}
                </Txt>
                {uploadTextEndContent}
              </Flx>
            )}

            <input
              id={inputId}
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            {!suppressUploadButton && (
              <Typography
                sx={{
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 700,
                  padding: "4px 10px",
                  border: `1px solid ${theme.palette.primary.main}`,
                  borderRadius: "4px",
                  background: isDraggingOver
                    ? `${theme.palette.primary.light}30`
                    : "transparent",
                  color: theme.palette.primary.main,
                }}
              >
                Browse Files
              </Typography>
            )}
          </>
        )}
      </Box>

      {displayedFiles.length > 0 && includeFileList && (
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ fontWeight: "bold", fontSize: "13px" }}>
            Uploaded Files
          </Typography>
          <List sx={{ p: 0 }}>
            {displayedFiles.map((fileObj, idx) => (
              <ListItem
                key={fileObj.id}
                sx={{
                  background: grey[50],
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom:
                    idx + 1 === displayedFiles.length
                      ? "none"
                      : `1px solid ${grey[200]}`,
                }}
              >
                <Typography sx={{ fontSize: "13px" }}>
                  {fileObj.name}
                </Typography>
                <IconButton color="error" onClick={() => onFileDelete(idx)}>
                  <CloseRounded />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </>
  );
};

export default FileUploadField;
