import React, { forwardRef, useState } from "react";

import {
  AddRounded,
  CheckBoxOutlineBlank,
  CheckBoxRounded,
  DeleteOutlineRounded,
  RemoveCircleOutline,
  SaveAsOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  ClickAwayListener,
  Grow,
  IconButton,
  Paper,
  Popper,
  Tooltip,
} from "@mui/material";
import { grey, red } from "@mui/material/colors";
import { isEmpty, isNil } from "lodash";
import Flx from "../../components/layout/Flx";
import { useForm, useFormState } from "react-final-form";
import BasicModal from "../../components/modals/BasicModal";
import InputWrapper from "../../components/inputs/shared/InputWrapper";
import TextInput from "../../components/inputs/TextInput";
import Txt from "../../components/typography/Txt";

const LocalStorageOptionRenderer = forwardRef(
  ({ lsPrefix, size = "small", saves, onUpdate }, ref) => {
    const anchorRef = React.useRef(null);
    const storedLayouts = localStorage.getItem(lsPrefix);
    // const [layouts, setLayouts] = useState(
    //   storedLayouts ? JSON.parse(storedLayouts) : []
    // );
    const { values } = useFormState();
    const { change } = useForm();
    const [open, setOpen] = React.useState(false);
    const [modalOpen, setModalOpen] = React.useState(false);

    const handleLayoutDelete = (layoutName) => {
      const updatedLayouts = saves.filter((l) => l.name !== layoutName);
      onUpdate(updatedLayouts);
      localStorage.setItem(lsPrefix, JSON.stringify(updatedLayouts));
    };

    const handleSaveAs = () => {
      setOpen(false);
      setModalOpen(true);
    };

    const handleSaveLayout = (layoutName) => {
      const newLayout = {
        name: layoutName,
        state: values,
      };
      const updated = [...saves, newLayout];

      onUpdate(updated);
      localStorage.setItem(lsPrefix, JSON.stringify(updated));
      setOpen(false);
    };

    const handleClosePopper = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }

      setOpen(false);
    };

    // if (isEmpty(saves)) {
    //   return null;
    // }
    return (
      <>
        <Flx ac gap={1}>
          <SavedLayoutRenderer
            ref={ref}
            saves={saves}
            onLayoutDelete={handleLayoutDelete}
          />
          <IconButton size="small" onClick={handleSaveAs}>
            <AddRounded className="thin" />
          </IconButton>
        </Flx>

        {/* <ClickAwayListener sx={{ zIndex: 111 }} onClickAway={handleClosePopper}>
          <Popper
            sx={{
              zIndex: 111,
              minWidth: "180px",
            }}
            placement="bottom-start"
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper elevation={2} sx={{ border: `1px solid ${grey[200]}` }}>
                  <Flx
                    column
                    sx={{
                      ".MuiButtonBase-root": {
                        justifyContent: "flex-start",
                        px: 1.5,
                        // py: 1,
                        fontWeight: 400,
                        color: (t) => t.palette.text.primary,
                        ".MuiButton-icon": {
                          // ml: 0.2,
                          ".MuiSvgIcon-root": {
                            color: (t) => t.palette.primary.main,
                            justifyContent: "center",
                            display: "flex",
                            fontSize: "14px !important",
                          },
                        },
                      },
                    }}
                  >
                   
                    <Button
                      variant="text"
                      size="medium"
                      onClick={handleSaveAs}
                      startIcon={<SaveAsOutlined className="thin" />}
                    >
                      Save As Template
                    </Button>
                  </Flx>
                </Paper>
              </Grow>
            )}
          </Popper>
        </ClickAwayListener> */}

        <LayoutDialog
          show={modalOpen}
          onSave={handleSaveLayout}
          onClose={() => setModalOpen(false)}
        />
      </>
    );

    // return (
    //   <>
    //     {/* <Button onClick={handleClick}>{options[selectedIndex]}</Button> */}
    //     <Button
    //       ref={anchorRef}
    //       size={size}
    //       aria-controls={open ? "table-options" : undefined}
    //       aria-expanded={open ? "true" : undefined}
    //       aria-label="table-options"
    //       aria-haspopup="menu"
    //       startIcon={<SettingsOutlined className="thin" />}
    //       variant="outlined"
    //       onClick={handleTogglePopper}
    //       endIcon={
    //         <KeyboardArrowDownRounded
    //           className="thin"
    //           sx={{
    //             transform: open ? "rotate(-180deg)" : "rotate(0deg)",
    //             transition: "0.3s",
    //           }}
    //         />
    //       }
    //     >
    //       Layouts & Settings
    //     </Button>
    //     <LayoutDialog
    //       show={isNil(saveDialogState) ? false : true}
    //       onSave={handleSaveLayout}
    //       onClose={() => setSaveDialogState(null)}
    //     />
    //     {/* <ClickAwayListener sx={{ zIndex: 111 }} onClickAway={handleClosePopper}> */}
    //     <Popper
    //       sx={{
    //         zIndex: 111,
    //         minWidth: "240px",
    //       }}
    //       placement="bottom-start"
    //       open={open}
    //       anchorEl={anchorRef.current}
    //       role={undefined}
    //       transition
    //       disablePortal
    //     >
    //       {({ TransitionProps, placement }) => (
    //         <Grow
    //           {...TransitionProps}
    //           style={{
    //             transformOrigin:
    //               placement === "bottom" ? "center top" : "center bottom",
    //           }}
    //         >
    //           <Paper elevation={2} sx={{ border: `1px solid ${grey[200]}` }}>
    //             <Flx
    //               column
    //               sx={{
    //                 ".MuiButtonBase-root": {
    //                   justifyContent: "flex-start",
    //                   // px: 2,
    //                   // py: 1,
    //                   fontWeight: 400,
    //                   color: (t) => t.palette.text.primary,
    //                   ".MuiButton-icon": {
    //                     // ml: 0.2,
    //                     ".MuiSvgIcon-root": {
    //                       color: (t) => t.palette.primary.main,
    //                       justifyContent: "center",
    //                       display: "flex",
    //                       fontSize: "14px !important",
    //                     },
    //                   },
    //                 },
    //               }}
    //             >
    //               <PopperGroup title="Table Options">
    //                 {children}
    //                 {children ? <Divider /> : null}
    //                 <AgButtonGetTableState
    //                   variant="text"
    //                   startIcon={<SaveOutlined className="thin" />}
    //                   onClick={handleShowSaveDialog}
    //                   ref={ref}
    //                 >
    //                   Save Current Layout
    //                 </AgButtonGetTableState>
    //                 <Divider />
    //                 <Button
    //                   variant="text"
    //                   startIcon={<ViewWeekOutlined className="thin" />}
    //                   onClick={() => ref?.current?.api?.autoSizeAllColumns()}
    //                 >
    //                   Auto Size Columns
    //                 </Button>
    //                 <Button
    //                   variant="text"
    //                   startIcon={<AspectRatioOutlined className="thin" />}
    //                   onClick={() => ref?.current?.api?.sizeColumnsToFit()}
    //                 >
    //                   Size Columns to Fit Screen Width
    //                 </Button>
    //                 {/* <Divider />
    //                 <AgButtonToggleFloatingFilter
    //                   variant="text"
    //                   startIcon={<FilterAltOutlined className="thin" />}
    //                   // onClick={handleShowSaveDialog}
    //                   ref={ref}
    //                 >
    //                   Toggle Floating Filters
    //                 </AgButtonToggleFloatingFilter> */}

    //                 <Divider />
    //                 <AgButtonResetState
    //                   variant="text"
    //                   startIcon={<RestoreRounded className="thin" />}
    //                   ref={ref}
    //                 >
    //                   Reset Table
    //                 </AgButtonResetState>
    //               </PopperGroup>

    //               <SavedLayoutRenderer
    //                 ref={ref}
    //                 layouts={layouts}
    //                 onLayoutDelete={handleLayoutDelete}
    //               />
    //             </Flx>
    //           </Paper>
    //         </Grow>
    //       )}
    //     </Popper>
    //     {/* </ClickAwayListener> */}
    //   </>
    // );
  }
);

const SavedLayoutRenderer = forwardRef(({ onLayoutDelete, saves }, ref) => {
  if (isEmpty(saves)) {
    return null;
  }
  return saves.map((save, idx) => {
    return (
      <LoadTableLayoutButton
        key={idx}
        ref={ref}
        data={save?.state}
        onDelete={onLayoutDelete}
        name={save.name}
      />
    );
  });
});

const LayoutDialog = ({ show, onSave, onClose }) => {
  const [input, setInput] = useState("");

  const handleOnSave = () => {
    onSave(input);
    handleOnClose();
  };

  const handleOnClose = () => {
    setInput("");
    onClose();
  };

  return (
    <BasicModal
      maxWidth="xs"
      title="Save Form as Template"
      show={show}
      onClose={handleOnClose}
      sx={{ zIndex: 1111 }}
    >
      <Box sx={{ mb: 4 }}>
        <Txt>
          The information you've entered will be saved as a template. You can
          apply this template later to prepopulate the form.
        </Txt>
      </Box>
      <InputWrapper label="Template Name">
        <TextInput autoFocus value={input} onChange={setInput} />
      </InputWrapper>
      <Button size="large" fullWidth sx={{ mt: 2 }} onClick={handleOnSave}>
        Save Template
      </Button>
    </BasicModal>
  );
};

const LoadTableLayoutButton = forwardRef(({ name, data, onDelete }, ref) => {
  const { change } = useForm();
  const { values } = useFormState();

  const onClick = () => {
    change(values, data);
    return;
  };
  return (
    <Flx
      jb
      ac
      sx={{
        borderRadius: "6px",
        border: `1px solid ${grey[300]}`,
        overflow: "hidden",
      }}
    >
      <Button
        onClick={onClick}
        sx={{
          flexGrow: 1,
          px: 1.5,
          borderRight: `1px solid ${grey[300]}`,
          borderTopRightRadius: "0",
          borderBottomRightRadius: "0",
        }}
        variant="text"
      >
        {name}
      </Button>

      <Tooltip title="Delete Layout" placement="top">
        <IconButton
          onClick={() => onDelete(name)}
          color="error"
          size="small"
          sx={{ borderRadius: "0" }}
        >
          <DeleteOutlineRounded
            className="thin"
            sx={{ color: red[500], fontSize: "16px" }}
          />
        </IconButton>
      </Tooltip>
    </Flx>
  );
});
export default LocalStorageOptionRenderer;
