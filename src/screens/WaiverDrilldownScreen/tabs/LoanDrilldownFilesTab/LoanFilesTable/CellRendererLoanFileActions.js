import { useLoanFilesHook } from "../../../../../hooks/useLoanFilesHook";
import {
  BookmarkAddedRounded,
  CheckRounded,
  CloseRounded,
  DownloadOutlined,
  EditOutlined,
  FileDownloadOffOutlined,
  OpenInNewOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Tooltip } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sidebarSetValues } from "../../../../../redux/actions/sidebarActions";
import { loanDrilldownSet } from "../../../../../redux/actions/loanDrilldownActions";
import Flx from "../../../../../components/layout/Flx";
import MoreOptionsDropdown from "../../../../../components/ui/menus/MoreOptionsDropdown";

const CellRendererLoanFileActions = ({
  params,
  isEditing,
  onStartEdit,
  onStopEdit,
  onReset,
  originalData,
}) => {
  const { loading, getFileById, updateLoanDocMetadata } = useLoanFilesHook();
  const [externalDownloadLoading, setExternalDownloadLoading] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const dispatch = useDispatch();

  const onPreviewClick = useCallback(
    (file) => {
      dispatch(
        sidebarSetValues({
          type: "filePreview",
          state: file,
        })
      );
    },
    [dispatch]
  );

  const onDownloadClick = () => {
    getFileById({
      loanId: params?.data?.dealId,
      file_storage_name: params?.data?.file_storage_name,
      fileDownloadName: params?.data?.file_display_name,
      fileDownload: true,
    });
  };

  const handleOnExternalDownloadClick = useCallback(
    (params) => {
      setExternalDownloadLoading(true);
      getFileById({
        loanId: params?.data?.dealId,
        file_storage_name: params?.data?.file_storage_name,
        fileDownloadName: params?.data?.file_display_name,
        openInNewTab: true,
        onSuccessFn: () => {
          setExternalDownloadLoading(false);
        },
      });
    },
    [getFileById]
  );

  const handleOnPreviewClick = useCallback(
    (params) => {
      onPreviewClick(params?.data);
    },
    [onPreviewClick]
  );

  const getChangedFields = useCallback((currentData, originalData) => {
    const changes = { _id: currentData._id };

    Object.keys(currentData).forEach((key) => {
      if (currentData[key] !== originalData[key]) {
        changes[key] = currentData[key];
      }
    });

    // Remove _id from comparison but keep it in the result
    if (Object.keys(changes).length === 1) {
      return null; // No changes
    }

    return changes;
  }, []);

  const handleSaveChanges = useCallback(() => {
    if (!originalData) return;

    const changedFields = getChangedFields(params.data, originalData);

    if (!changedFields) {
      onStopEdit();
      return;
    }

    setSaveLoading(true);
    console.log("Saving changes:", changedFields);

    // return; // Remove this when ready to test endpoint

    updateLoanDocMetadata({
      loanId: loanDrilldown?._id,
      data: [changedFields],
      onSuccessFn: (data) => {
        dispatch(loanDrilldownSet(data));
        onStopEdit();
        setSaveLoading(false);
      },
      onErrorFn: () => {
        setSaveLoading(false);
      },
    });
  }, [
    params.data,
    originalData,
    getChangedFields,
    onStopEdit,
    updateLoanDocMetadata,
    loanDrilldown?._id,
    dispatch,
  ]);

  if (isEditing) {
    return (
      <Flx
        fw
        jc
        sx={{
          width: "190px",
          ml: "-5px",
          ".MuiIconButton-root": {
            borderRadius: "0",
            width: "32px",
            height: "30px",
            p: 0,
            pt: 0.3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <Tooltip title="Cancel">
          <IconButton
            onClick={onStopEdit}
            size="small"
            color="error"
            disabled={saveLoading}
          >
            <CloseRounded className="thin-5" sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        <Button
          onClick={handleSaveChanges}
          size="small"
          color="primary"
          loading={saveLoading}
          // startIcon={
          //   <SaveRounded
          //     sx={{ fontSize: "16px !important" }}
          //     className="thin-7"
          //   />
          // }
          disabled={saveLoading}
        >
          Save Changes
        </Button>
      </Flx>
    );
  }

  return (
    <Flx
      ac
      sx={{
        ".MuiButtonBase-root": {
          borderRadius: "0",
          width: "32px",
          height: "30px",
          p: 0,
          pt: 0.3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <Tooltip title="Download">
        <IconButton
          disabled={loading && !externalDownloadLoading}
          onClick={onDownloadClick}
          size="small"
          color="primary"
        >
          <DownloadOutlined className="thin-7" sx={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Open In New Tab">
        <IconButton
          disabled={externalDownloadLoading}
          onClick={() => handleOnExternalDownloadClick(params)}
          size="small"
          color="primary"
        >
          <OpenInNewOutlined className="thin-6" sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Preview">
        <IconButton
          onClick={() => handleOnPreviewClick(params)}
          size="small"
          color="primary"
        >
          <VisibilityOutlined className="thin-5" sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>
      {/* <MoreFileOptionsIconButton
        file={params?.data}
        params={params}
        onEditClick={onStartEdit}
      /> */}
    </Flx>
  );
};

const MoreFileOptionsIconButton = ({ params, onEditClick }) => {
  const file = params.data; // assuming params.data is the file object
  const dispatch = useDispatch();
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const { updateLoanDocMetadata } = useLoanFilesHook();

  const [markFinalLoading, setMarkFinalLoading] = useState(false);
  const [markHiddenLoading, setMarkHiddenLoading] = useState(false);
  const [excludeFromExportLoading, setExcludeFromExportLoading] =
    useState(false);
  const [approvedForThirdPartyLoading, setApprovedForThirdPartyLoading] =
    useState(false);

  // Handler functions for each action:
  const handleEdit = useCallback(() => {
    if (typeof onEditClick === "function") {
      onEditClick(params);
    }
  }, [onEditClick, params]);

  const handleMarkFinal = useCallback(() => {
    setMarkFinalLoading(true);
    const updatedRowData = { _id: file._id, isFinal: true };

    updateLoanDocMetadata({
      loanId: loanDrilldown?._id,
      data: [updatedRowData],
      onSuccessFn: (data) => {
        dispatch(loanDrilldownSet(data));
        setMarkFinalLoading(false);
      },
      onErrorFn: () => {
        setMarkFinalLoading(false);
      },
    });
  }, [file._id, updateLoanDocMetadata, loanDrilldown?._id, dispatch]);

  const handleToggleHidden = useCallback(() => {
    setMarkHiddenLoading(true);
    const updatedRowData = {
      _id: file._id,
      isHidden: !file.isHidden,
    };

    updateLoanDocMetadata({
      loanId: loanDrilldown?._id,
      data: [updatedRowData],
      onSuccessFn: (data) => {
        dispatch(loanDrilldownSet(data));
        setMarkHiddenLoading(false);
      },
      onErrorFn: () => {
        setMarkHiddenLoading(false);
      },
    });
  }, [
    file._id,
    file.isHidden,
    updateLoanDocMetadata,
    loanDrilldown?._id,
    dispatch,
  ]);

  const handleToggleExcludeExport = useCallback(() => {
    setExcludeFromExportLoading(true);
    const updatedRowData = {
      _id: file._id,
      excludeFromExport: !file.excludeFromExport,
    };

    updateLoanDocMetadata({
      loanId: loanDrilldown?._id,
      data: [updatedRowData],
      onSuccessFn: (data) => {
        dispatch(loanDrilldownSet(data));
        setExcludeFromExportLoading(false);
      },
      onErrorFn: () => {
        setExcludeFromExportLoading(false);
      },
    });
  }, [
    file._id,
    file.excludeFromExport,
    updateLoanDocMetadata,
    loanDrilldown?._id,
    dispatch,
  ]);

  const handleToggleApproved = useCallback(() => {
    setApprovedForThirdPartyLoading(true);
    const updatedRowData = {
      _id: file._id,
      approvedForThirdParty: !file.approvedForThirdParty,
    };

    updateLoanDocMetadata({
      loanId: loanDrilldown?._id,
      data: [updatedRowData],
      onSuccessFn: (data) => {
        dispatch(loanDrilldownSet(data));
        setApprovedForThirdPartyLoading(false);
      },
      onErrorFn: () => {
        setApprovedForThirdPartyLoading(false);
      },
    });
  }, [
    file._id,
    file.approvedForThirdParty,
    updateLoanDocMetadata,
    loanDrilldown?._id,
    dispatch,
  ]);

  // Build the “items” array for MoreOptionsDropdown:
  const dropdownItems = useMemo(
    () => [
      {
        label: "Edit Document",
        icon: <EditOutlined fontSize="small" />,
        onClick: handleEdit,
      },
      {
        label: markFinalLoading ? "Marking..." : "Mark As Final",
        icon: <CheckRounded fontSize="small" />,
        onClick: handleMarkFinal,
        loading: markFinalLoading,
      },
      {
        label: markHiddenLoading
          ? "Updating..."
          : file.isHidden
            ? "Mark Visible"
            : "Mark Hidden",
        icon: <VisibilityOffOutlined fontSize="small" />,
        onClick: handleToggleHidden,
        loading: markHiddenLoading,
      },
      {
        label: excludeFromExportLoading
          ? "Updating..."
          : file.excludeFromExport
            ? "Include In Export"
            : "Exclude From Export",
        icon: <FileDownloadOffOutlined fontSize="small" />,
        onClick: handleToggleExcludeExport,
        loading: excludeFromExportLoading,
      },
      {
        label: approvedForThirdPartyLoading
          ? "Updating..."
          : file.approvedForThirdParty
            ? "Not Approved For Third Party"
            : "Approved For Third Party",
        icon: <BookmarkAddedRounded fontSize="small" />,
        onClick: handleToggleApproved,
        loading: approvedForThirdPartyLoading,
      },
    ],
    [
      file,
      handleEdit,
      handleToggleApproved,
      handleToggleExcludeExport,
      handleToggleHidden,
      handleMarkFinal,
      markFinalLoading,
      markHiddenLoading,
      excludeFromExportLoading,
      approvedForThirdPartyLoading,
    ]
  );

  const fileName = useMemo(() => file.file_display_name, [file]);

  return (
    <MoreOptionsDropdown
      title={fileName}
      tooltip="More Options"
      items={dropdownItems}
    />
  );
};
export default CellRendererLoanFileActions;
