import React, { useMemo, useRef, useState } from "react";
import { Field } from "react-final-form";
import {
  Box,
  FormHelperText,
  IconButton,
  List,
  ListItem,
  Typography,
  useTheme,
} from "@mui/material";
import {
  CloseRounded,
  DeleteOutline,
  FileUploadOutlined,
} from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { v4 as uuidv4 } from "uuid"; // <-- import uuid
import RffInputWrapper from "../shared/RffInputWrapper";
import { VALIDATOR_REQUIRE } from "../../../utils/finalForm/validators/VALIDATOR_REQUIRE";
import Flx from "../../layout/Flx";
import Txt from "../../typography/Txt";
import { isEmpty } from "lodash";

const RffFileUploadField = ({
  /** (Optional) If provided, we tag each uploaded file with this docGroup. */
  docGroup,

  /** (Optional) If provided, we tag each uploaded file with this docType. */
  docType,

  /** Label for the UI */
  label,

  /** If true, runs a required validator on the "files" array. */
  required,

  /** If using within a grid system or specifying its width, etc. */
  suppressGrid,
  size,
  suppressIcon,
  /** Visible height of the dropzone */
  height = "180px",
  uploadText = "Drag & drop files here or click to select files",
  /** Additional styles for the outer dropzone box */
  sx,
  suppressButton,
  helperText,
  /** Border size for drag states */
  borderSize = 3,
  /** Background color */
  background = "transparent",
}) => {
  const theme = useTheme();
  const dragCounter = useRef(0);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // If "required" is true, we'll run the standard required validator
  const validate = useMemo(
    () => (required ? VALIDATOR_REQUIRE : undefined),
    [required]
  );

  // Drag state management (same as FileUploadField)
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (dragCounter.current === 1) {
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDraggingOver(false);
    }
  };

  return (
    <RffInputWrapper
      label={label}
      suppressGrid={suppressGrid}
      size={size}
      required={required}
      helperText={helperText}
    >
      <Field
        name="uploadMetadata"
        // name="uploadFiles"
        validate={validate}
        subscription={{ value: true, error: true, touched: true }}
        render={({ input, meta }) => {
          // "input.value" is our entire array of all files, possibly empty
          const allFiles = Array.isArray(input.value) ? input.value : [];

          /**
           * Filter: show only files that match *this* component's docGroup/docType.
           * If docGroup is defined, we only display files with *the same* docGroup.
           * If docGroup is *not* defined, we only display files with no docGroup.
           * Same logic for docType.
           */
          const displayedFiles = allFiles.filter((fileObj) => {
            const matchesGroup = docGroup
              ? fileObj.docGroup === docGroup
              : !fileObj.docGroup; // if no docGroup passed in, show only ones that have no docGroup

            const matchesType = docType
              ? fileObj.docType === docType
              : !fileObj.docType; // if no docType passed in, show only ones that have no docType

            return matchesGroup && matchesType;
          });

          /**
           * Handle adding new files to the global array
           */
          const onFilesAdded = (newRawFiles) => {
            const newFiles = newRawFiles.map((rawFile) => {
              // Generate a unique ID and store it in both places:
              const newId = uuidv4();
              // Attach the ID to the file itself (so file.id and top-level id match)
              // rawFile.id = newId;

              return {
                id: newId,
                file: rawFile,
                name: rawFile.name,
                file_display_name: rawFile.name,
                docGroup: docGroup || null,
                docType: docType || null,
              };
            });

            // Combine existing + newly added
            const updatedFiles = [...allFiles, ...newFiles];
            input.onChange(updatedFiles);
          };

          /**
           * Delete a file from the global array
           */
          const onFileDelete = (indexInDisplayed) => {
            const fileToRemove = displayedFiles[indexInDisplayed];
            const updatedFiles = allFiles.filter((f) => f !== fileToRemove);
            input.onChange(updatedFiles);
          };

          /**
           * Drag & drop events (enhanced with state management)
           */
          const handleDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
          };

          const handleDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter.current = 0;
            setIsDraggingOver(false);
            if (!e.dataTransfer.files) return;
            const droppedFiles = Array.from(e.dataTransfer.files);
            onFilesAdded(droppedFiles);
          };

          /**
           * Standard file selection via input[type=file]
           */
          const handleFileChange = (e) => {
            if (!e.target.files) return;
            onFilesAdded(Array.from(e.target.files));
          };

          /**
           * Programmatically open the file dialog
           */
          const handleClickDropzone = () => {
            const fileInput = document.getElementById(
              `files-fileinput-${docGroup || "noGroup"}-${docType || "noType"}`
            );
            if (fileInput) fileInput.click();
          };

          return (
            <>
              {/* The Drag & Drop Zone */}
              <Box
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClickDropzone}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 100ms ease-in-out",
                  height,
                  padding: "1rem",
                  gap: 2,
                  borderRadius: "4px",
                  background: isDraggingOver
                    ? `${theme.palette.primary.light}20`
                    : background,
                  // spread user overrides first...
                  ...(sx || {}),
                  // ...then override border and color last when dragging
                  border: isDraggingOver
                    ? `${borderSize}px dashed ${theme.palette.primary.main}`
                    : `${borderSize}px dashed ${grey[300]}`,
                  // color drives children
                  color: isDraggingOver
                    ? theme.palette.primary.main
                    : grey[600],
                  borderBottomLeftRadius: isEmpty(displayedFiles) ? "4px" : "0",
                  borderBottomRightRadius: isEmpty(displayedFiles)
                    ? "4px"
                    : "0",
                }}
              >
                {suppressIcon ? null : (
                  <FileUploadOutlined
                    sx={{ opacity: isDraggingOver ? 0.8 : 0.55 }}
                  />
                )}
                <Txt
                  sx={{
                    fontSize: "13px",
                    opacity: isDraggingOver ? 0.9 : 0.7,
                  }}
                >
                  {uploadText}
                </Txt>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  // Unique-ish ID so multiple fields won't conflict
                  id={`files-fileinput-${docGroup || "noGroup"}-${docType || "noType"}`}
                />
                {suppressButton ? null : (
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
              </Box>

              {/* Show validation error if needed */}
              {meta.touched && meta.error && (
                <FormHelperText error>{meta.error}</FormHelperText>
              )}

              {/* Display the subset of files for the docGroup/docType */}
              {displayedFiles.length > 0 && (
                <List
                  sx={{
                    listStyle: "none",
                    p: 0.8,
                    // py: 0,
                    // pt: 0.5,
                    pt: 0.3,
                    mb: 2,
                    // background: grey[50],
                    border: `1px solid ${grey[300]}`,
                    borderBottomLeftRadius: "4px",
                    borderTop: 0,
                    borderBottomRightRadius: "4px",
                  }}
                >
                  {/* <Txt sx={{ fontSize: "11px", opacity: 0.6 }}>
                    Uploaded Files
                  </Txt> */}
                  {displayedFiles.map((fileObj, idx) => (
                    <ListItem
                      key={idx}
                      sx={{
                        // background: "#ffffff",
                        background: grey[100],
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "4px 8px",
                        pr: 0.4,
                        fontSize: "11px !important",
                        display: "flex",
                        borderRadius: "4px",
                        mt: 0.5,
                        border: `1px solid ${grey[300]}`,
                      }}
                    >
                      <Txt
                        sx={{
                          marginRight: "8px",
                          fontSize: "11px !important",
                        }}
                      >
                        {/* The raw File object is in fileObj.file, but we stored .name too */}
                        {fileObj.file_display_name}
                      </Txt>
                      <IconButton
                        color="error"
                        size="small"
                        sx={{ padding: "4px" }}
                        onClick={() => onFileDelete(idx)}
                      >
                        <CloseRounded sx={{ fontSize: "14px" }} />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </>
          );
        }}
      />
    </RffInputWrapper>
  );
};

export default RffFileUploadField;
