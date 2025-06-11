import {
  Close as CloseIcon,
  Error as ErrorIcon,
  ImageOutlined,
  InsertDriveFileOutlined,
  KeyboardArrowRightRounded,
  LibraryAddOutlined,
  PictureAsPdfOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { isArray, isNil } from "lodash";
import { useEffect, useState } from "react";

import Txt from "../../../../components/typography/Txt";
import { useLoanFilesHook } from "../../../../hooks/useLoanFilesHook";
import DownloadLoanFileIconButton from "../../shared/DownloadLoanFileIconButton";
import OpenLoanFileInNewTabButton from "../../shared/OpenLoanFileInNewTabButton";
import Flx from "../../../../components/layout/Flx";

/**
 * FileIcon
 * Renders an icon based on the file's MIME type.
 */
const FileIcon = ({ contentType, size = 48, color = "text.secondary" }) => {
  if (contentType?.startsWith("image/")) {
    return <ImageOutlined className="thin" sx={{ fontSize: size, color }} />;
  }
  if (contentType === "application/pdf") {
    return (
      <PictureAsPdfOutlined className="thin" sx={{ fontSize: size, color }} />
    );
  }
  return (
    <InsertDriveFileOutlined className="thin" sx={{ fontSize: size, color }} />
  );
};

/**
 * ErrorOverlay
 * Renders an overlay when there's an error fetching or processing the file.
 */
const ErrorOverlay = ({ error, onFetchFileClick }) => {
  if (isNil(error)) return null;
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          p: 2,
        }}
      >
        <ErrorIcon color="error" sx={{ fontSize: 40 }} />
        <Typography variant="body1" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
        <Button variant="contained" onClick={onFetchFileClick} sx={{ mt: 2 }}>
          Try Again
        </Button>
      </Box>
    </Box>
  );
};

/**
 * LoanFilePreview
 * Renders a file preview (image/PDF/other) and optionally loads associated comments.
 */
const LoanFilePreview = ({
  fileObject,
  onClose,
  showDownloadButton = true,
  height = "100%",
  width = "100%",
  onShowCommentsClick,
  sx = {},
}) => {
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { loading, getFileById } = useLoanFilesHook();

  const content_type = fileObject?.content_type;
  const file_display_name = fileObject?.file_display_name;
  const file_storage_name = fileObject?.file_storage_name;
  const loanId = fileObject?.dealId;

  const isImage = content_type?.startsWith("image/");
  const isPdf = content_type === "application/pdf";

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (fileObject && file_storage_name && loanId) fetchFile();
  }, [fileObject]);

  const fetchFile = () => {
    setError(null);
    getFileById({
      loanId,
      file_storage_name,
      isFile: true,
      onSuccessFn: (responseData) => {
        try {
          const blob =
            responseData instanceof Blob
              ? responseData
              : new Blob([responseData], { type: content_type });
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);
        } catch (err) {
          console.error("Error creating Blob URL:", err);
          setError(
            "Failed to process the file. The format may be unsupported."
          );
        }
      },
      onErrorFn: (err) => {
        console.error("Error fetching file:", err);
        setError("Failed to load the file. Please try again.");
      },
    });
  };

  if (isNil(fileObject)) return null;

  // Empty state when no file selected
  if (!fileObject) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height,
          width,
          p: 3,
          ...sx,
        }}
      >
        <FileIcon contentType={content_type} />
        <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
          No file selected for preview
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height,
        background: "#ffffff",
        position: "relative",
        overflow: "hidden",
        ...sx,
      }}
    >
      {/* Header */}
      <Divider />
      <Flx column sx={{ background: "#ffffff", p: 0.5, pl: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            // p: 1.5,
            py: 0.8,
            px: 0.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              minWidth: 0, // allow this container to shrink
              flexGrow: 1,
              gap: 1,
              overflow: "hidden", // clip any overflow
            }}
          >
            <FileIcon
              contentType={content_type}
              size={28}
              color="action"
              sx={{ flexShrink: 0 }}
            />

            {/* make this flex‐column container shrinkable */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                flexGrow: 1,
                mt: "-0.5px",
                overflow: "hidden", // important so children ellipsize
              }}
            >
              <Tooltip title={file_display_name || "File Preview"}>
                <Typography
                  sx={{
                    fontSize: "13px",
                    overflow: "hidden", // clip overflow
                    textOverflow: "ellipsis", // show “…”
                    whiteSpace: "nowrap", // single line
                    width: "100%", // fill the parent box
                  }}
                >
                  {file_display_name || "File Preview"}
                </Typography>
              </Tooltip>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  flexShrink: 0,
                }}
              >
                <Txt
                  secondary
                  sx={{
                    fontSize: "10px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "300px",
                  }}
                >
                  {fileObject?.docGroup || "N/A"}
                </Txt>
                <KeyboardArrowRightRounded sx={{ fontSize: "10px" }} />
                <Txt
                  secondary
                  sx={{
                    fontSize: "10px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "300px",
                  }}
                >
                  {fileObject?.docType || "N/A"}
                </Txt>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexShrink: 0,
              ml: 1,
              ".MuiSvgIcon-root": {
                fontSize: "16px",
              },
            }}
          >
            <OpenLoanFileInNewTabButton
              loanId={loanId}
              fileObject={fileObject}
            />
            <DownloadLoanFileIconButton
              loanId={loanId}
              fileObject={fileObject}
              showDownloadButton={showDownloadButton}
            />
            {onClose && (
              <IconButton onClick={onClose} color="default" size="medium">
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        </Box>
        <Flx gap={1} ac sx={{ flexShrink: 0 }}>
          {/* <Txt
            secondary
            sx={{
              fontSize: "10px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "300px",
            }}
          >
            {fileObject?.docGroup || "N/A"}
          </Txt>
          <KeyboardArrowRightRounded sx={{ fontSize: "10px" }} />
          <Txt
            secondary
            sx={{
              fontSize: "10px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "300px",
            }}
          >
            {fileObject?.docType || "N/A"}
          </Txt> */}

          {/* <Flx gap={0.5} sx={{ flexShrink: 0 }}>
            <Txt secondary sx={{ fontSize: "10px" }}>
              Group:
            </Txt>
            <Txt
              sx={{
                fontSize: "10px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "300px",
              }}
            >
              {fileObject?.docGroup || "N/A"}
            </Txt>
          </Flx>
          <KeyboardArrowRightRounded sx={{ fontSize: "10px" }} />
          <Flx gap={0.5} ac sx={{ flexShrink: 0 }}>
            <Txt
              sx={{
                fontSize: "10px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "300px",
              }}
            >
              {fileObject?.docType || "N/A"}
            </Txt>
          </Flx> */}
        </Flx>
      </Flx>
      <Divider />

      {/* Preview Body */}
      <Box
        sx={{
          position: "relative",
          flexGrow: 1,

          // overflow: "auto",
          bgcolor: (theme) => theme.palette.grey[50],
        }}
      >
        {/* Loading Overlay */}
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.6)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <CircularProgress sx={{ color: "#ffffff" }} />
              <Txt body2 sx={{ mt: 2, color: "#ffffff" }}>
                Loading file...
              </Txt>
            </Box>
          </Box>
        )}
        {/* Error Overlay */}
        <ErrorOverlay error={error} onFetchFileClick={fetchFile} />
        {/* Actual Preview */}
        {!loading && !error && previewUrl && (
          <>
            {isImage && (
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "center",
                  height: "100%",
                  background: "#282828",
                }}
              >
                <img
                  src={previewUrl}
                  alt={file_display_name || "Image preview"}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    border: "1px solid #ffffff85",
                    borderRadius: 2,
                  }}
                />
              </Box>
            )}
            {isPdf && (
              <iframe
                src={previewUrl}
                title={file_display_name || "PDF preview"}
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            )}
            {!isImage && !isPdf && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  p: 3,
                }}
              >
                <FileIcon contentType={content_type} />
                <Typography variant="body1" sx={{ mt: 2, textAlign: "center" }}>
                  This file type ({content_type}) cannot be previewed.
                </Typography>
                <DownloadLoanFileIconButton
                  loanId={loanId}
                  fileObject={fileObject}
                  showDownloadButton={showDownloadButton}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default LoanFilePreview;
