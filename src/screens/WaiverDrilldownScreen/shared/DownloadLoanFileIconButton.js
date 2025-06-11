import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { DownloadOutlined } from "@mui/icons-material";
import { useLoanFilesHook } from "../../../hooks/useLoanFilesHook";

/**
 * DownloadLoanFileIconButton
 *
 * Renders a button that downloads the given file.
 */
const DownloadLoanFileIconButton = ({
  loanId,
  showDownloadButton,
  fileObject,
}) => {
  const { loading, getFileById } = useLoanFilesHook();

  if (!showDownloadButton) return null;

  const handleDownload = () => {
    if (!fileObject) return;

    getFileById({
      loanId,
      file_storage_name: fileObject.file_storage_name,
      fileDownloadName: fileObject.file_display_name,
      fileDownload: true,
      isFile: true,
    });
  };

  return (
    <Tooltip title="Download">
      <IconButton
        onClick={handleDownload}
        disabled={loading}
        color="primary"
        size="small"
      >
        <DownloadOutlined />
      </IconButton>
    </Tooltip>
  );
};

export default DownloadLoanFileIconButton;
