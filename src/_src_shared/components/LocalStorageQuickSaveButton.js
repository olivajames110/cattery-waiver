import { forwardRef, memo } from "react";

import { RemoveCircleOutline, SaveOutlined } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";
import { initial, isEqual, isFunction, isNil } from "lodash";
import { closeSnackbar, enqueueSnackbar } from "notistack";
import { useFormState } from "react-final-form";
import Flx from "../../components/layout/Flx";
import CustomSnackbar from "./CustomSnackbar";

const LocalStorageQuickSaveButton = forwardRef(
  (
    {
      lsPrefix,
      size = "small",
      quickSaveData,
      onUpdated,
      initialValues,
      resetFormData,
    },
    ref
  ) => {
    const lsQuickSave = `${lsPrefix}-quickSave`;

    const { values } = useFormState();

    const handleQuickSave = () => {
      console.log("handleQuickSave", values);
      onUpdated(values);
      localStorage.setItem(lsQuickSave, JSON.stringify(values));
      enqueueSnackbar(
        "Changes Saved",

        {
          autoHideDuration: 2800,
          anchorOrigin: {
            vertical: "bottom", // bottom
            horizontal: "right", // left || center || right
          },
          content: (key, message) => (
            <CustomSnackbar
              id={key}
              message={message}
              variant="success"
              closeSnackbar={() => closeSnackbar(key)}
            />
          ),
        }
      );
    };

    const handleClearQuickSave = () => {
      localStorage.removeItem(lsQuickSave);
      // setQuickSaveData(null);
      if (isFunction(resetFormData)) {
        resetFormData();
      }
    };

    if (isEqual(values, initialValues)) {
      return null;
    }

    return (
      <Flx gap={1}>
        {isNil(quickSaveData) ? null : (
          <Button
            size={size}
            startIcon={<RemoveCircleOutline className="thin" />}
            variant="outlined"
            color="error"
            onClick={handleClearQuickSave}
          >
            Clear Saved Changes
          </Button>
        )}
        <Tooltip
          title="Temporarily saves your changes. This will clear once the form is submitted."
          disableInteractive
        >
          <Button
            size={size}
            startIcon={<SaveOutlined className="thin" />}
            variant="outlined"
            onClick={handleQuickSave}
          >
            Save Changes
          </Button>
        </Tooltip>
      </Flx>
    );
  }
);

export default memo(LocalStorageQuickSaveButton);
