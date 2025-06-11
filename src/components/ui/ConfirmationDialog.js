// src/components/ui/modals/ConfirmationDialog.jsx

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import Htag from "../typography/Htag";

/**
 * A simple confirmation dialog.
 *
 * Props:
 * - open: boolean – whether the modal is visible
 * - title: string – the dialog’s title text
 * - message: string – the main content/message inside the dialog
 * - confirmText: string (optional) – label for the confirm button (default: "Confirm")
 * - cancelText: string (optional) – label for the cancel button (default: "Cancel")
 * - onConfirm: () => void – callback when the user clicks “Confirm”
 * - onCancel: () => void – callback when the user clicks “Cancel” or closes the dialog
 *
 * Example:
 *   const [open, setOpen] = useState(false);
 *   const handleDelete = () => { /* delete logic *\/ };
 *   return (
 *     <>
 *       <Button onClick={() => setOpen(true)}>Delete Item</Button>
 *
 *       <ConfirmationDialog
 *         open={open}
 *         title="Delete Item?"
 *         message="Are you sure you want to delete this item? This action cannot be undone."
 *         confirmText="Delete"
 *         cancelText="Keep"
 *         onConfirm={() => {
 *           handleDelete();
 *           setOpen(false);
 *         }}
 *         onCancel={() => setOpen(false)}
 *       />
 *     </>
 *   );
 */
const ConfirmationDialog = ({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      {title && (
        <DialogContent sx={{ pb: 0 }} id="confirmation-dialog-title">
          <Htag sx={{ lineHeight: 1.4 }} h2>
            {title}
          </Htag>
        </DialogContent>
      )}

      {message && (
        <DialogContent>
          <DialogContentText id="confirmation-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
      )}

      <DialogActions>
        <Button onClick={onCancel} color="error" variant="outlined">
          {cancelText}
        </Button>
        <Button
          loading={loading}
          onClick={() => {
            onConfirm();
          }}
          // color="error"
          variant="contained"
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
