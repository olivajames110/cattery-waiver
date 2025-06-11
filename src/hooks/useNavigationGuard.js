// hooks/useNavigationGuard.js
import { useEffect, useCallback, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const useNavigationGuard = (hasUnsavedChanges, onSave) => {
  const [showNavigationDialog, setShowNavigationDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Custom navigation handler that checks for unsaved changes
  const guardedNavigate = useCallback(
    (path) => {
      if (hasUnsavedChanges) {
        setPendingNavigation(path);
        setShowNavigationDialog(true);
      } else {
        navigate(path);
      }
    },
    [hasUnsavedChanges, navigate]
  );

  // Override browser back button
  useEffect(() => {
    const handlePopState = (event) => {
      if (hasUnsavedChanges) {
        // Push the current state back to prevent navigation
        window.history.pushState(null, "", location.pathname);
        setPendingNavigation("back");
        setShowNavigationDialog(true);
      }
    };

    if (hasUnsavedChanges) {
      // Push a state to detect back navigation
      window.history.pushState(null, "", location.pathname);
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasUnsavedChanges, location.pathname]);

  // Handle browser navigation (refresh, close tab, etc.)
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return event.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Dialog handlers
  const handleStayOnPage = useCallback(() => {
    setShowNavigationDialog(false);
    setPendingNavigation(null);
  }, []);

  const handleLeaveWithoutSaving = useCallback(() => {
    setShowNavigationDialog(false);
    const navigation = pendingNavigation;
    setPendingNavigation(null);

    if (navigation === "back") {
      window.history.back();
    } else if (navigation) {
      navigate(navigation);
    }
  }, [pendingNavigation, navigate]);

  const handleSaveAndLeave = useCallback(async () => {
    if (onSave) {
      try {
        await onSave();
        setShowNavigationDialog(false);
        const navigation = pendingNavigation;
        setPendingNavigation(null);

        if (navigation === "back") {
          window.history.back();
        } else if (navigation) {
          navigate(navigation);
        }
      } catch (error) {
        console.error("Failed to save changes:", error);
        // Keep the dialog open if save fails
      }
    }
  }, [onSave, pendingNavigation, navigate]);

  return {
    showNavigationDialog,
    guardedNavigate,
    handleStayOnPage,
    handleLeaveWithoutSaving,
    handleSaveAndLeave,
  };
};

/**
 * 
 // Use the navigation guard hook
   const {
     showNavigationDialog,
     guardedNavigate,
     handleStayOnPage,
     handleLeaveWithoutSaving,
     handleSaveAndLeave,
   } = useNavigationGuard(hasUnsavedChanges, handleSave);
 
   // Functions
   const handleLayoutModeChange = useCallback((event, newMode) => {
     if (newMode !== null) {
       setLayoutMode(newMode);
     }
   }, []);
 
   const onHiddenFilesChange = useCallback((e) => {
     setShowHiddenFiles(e);
   }, []);
 
   const onEditClick = useCallback(() => {
     setEditing(true);
   }, []);
 
   const onEditCancel = () => {
     setRowData(files.map((f) => ({ ...f })));
     setSelectedRows([]);
     setChangedRows([]);
     setEditing(false);
   };
 
   const onUpdateClick = () => {
     updateLoanDocMetadata({
       loanId: loanDrilldown?._id,
       data: changedRows,
       onSuccessFn: (data) => {
         dispatch(loanDrilldownSet(data));
         setChangedRows([]);
         setEditing(false);
       },
     });
   };
 */
