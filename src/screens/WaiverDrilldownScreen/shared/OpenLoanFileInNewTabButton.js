import { DownloadOutlined, OpenInNewOutlined } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useLoanFilesHook } from "../../../hooks/useLoanFilesHook";

/**
 * OpenLoanFileInNewTabButton
 *
 * Renders a button that downloads the given file.
 */
const OpenLoanFileInNewTabButton = ({
  loanId,
  showDownloadButton,

  fileObject,
}) => {
  const { loading, getFileById } = useLoanFilesHook();

  const handleDownload = () => {
    if (!fileObject) return;

    getFileById({
      loanId,
      file_storage_name: fileObject.file_storage_name,
      fileDownloadName: fileObject.file_display_name,
      openInNewTab: true,
    });
  };

  return (
    <>
      <Tooltip title="Open in new tab">
        <IconButton
          onClick={handleDownload}
          disabled={loading}
          color="primary"
          size="small"
        >
          <OpenInNewOutlined />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default OpenLoanFileInNewTabButton;
