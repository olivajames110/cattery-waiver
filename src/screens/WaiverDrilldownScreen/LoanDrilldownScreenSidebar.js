import React, { memo, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  sidebarClear,
  sidebarTypeToggle,
} from "../../redux/actions/sidebarActions";
import DrilldownFilePreviewSidebar from "./sidebar/types/DrilldownFilePreviewSidebar";
import DrilldownSidebarComments from "./sidebar/types/DrilldownSidebarComments";
import DrilldownSidebarFormSpy from "./sidebar/types/DrilldownSidebarFormSpy";
import { loanDrilldownSidebarTypes } from "../../constants/enums/loanDrilldownScreenSidebarOptions";
import DrilldownSidebarAddBorrower from "./sidebar/types/DrilldownSidebarAddBorrower";
import DrilldownSidebarAddProperty from "./sidebar/types/DrilldownSidebarAddProperty";
import DrilldownSidebarAddException from "./sidebar/types/DrilldownSidebarAddException";
import DrilldownSidebarUnderwritingNotes from "./sidebar/types/DrilldownSidebarUnderwritingNotes";
import { Badge, Box, IconButton, Tooltip, useTheme } from "@mui/material";
import Flx from "../../components/layout/Flx";
import {
  CalculateOutlined,
  ChecklistOutlined,
  CodeOutlined,
  MoreVertRounded,
  NoteAltOutlined,
  QuestionAnswerOutlined,
  Subject,
  VerticalAlignBottom,
} from "@mui/icons-material";
import { size } from "lodash";
import DrilldownSidebarUnderwritingChecklist from "./sidebar/types/DrilldownSidebarUnderwritingChecklist";
import { blue } from "@mui/material/colors";
import DrilldownSidebarLoanTotals from "./sidebar/types/DrilldownSidebarLoanTotals";
import DrilldownFileUploadSidebar from "./sidebar/types/DrilldownFileUploadSidebar";

const LoanDrilldownScreenSidebar = memo(() => {
  const dispatch = useDispatch();
  const sidebarType = useSelector((state) => state.sidebar?.type);

  const options = [
    {
      label: "View Comments",
      tooltip: "View Comments",
      onClick: () =>
        dispatch(sidebarTypeToggle(loanDrilldownSidebarTypes.COMMENTS)),
      icon: <QuestionAnswerOutlined className="thin" />,
    },
    {
      label: "View Underwriting Notes",
      tooltip: "View Underwriting Notes",
      onClick: () =>
        dispatch(sidebarTypeToggle(loanDrilldownSidebarTypes.UW_NOTES)),
      icon: <NoteAltOutlined className="thin" />,
    },
    {
      label: "View Loan Totals",
      tooltip: "View Loan Totals",
      onClick: () =>
        dispatch(sidebarTypeToggle(loanDrilldownSidebarTypes.FORMSPY)),
      icon: <CodeOutlined className="thin" />,
    },
    {
      label: "View All Loan Data",
      tooltip: "View All Loan Data",
      onClick: () =>
        dispatch(sidebarTypeToggle(loanDrilldownSidebarTypes.FORMSPY)),
      icon: <CodeOutlined className="thin" />,
    },
  ];

  useEffect(() => {
    // Clear the side drawer state on unmount
    return () => {
      dispatch(sidebarClear());
    };
  }, [dispatch]);

  // if (!sidebarType) return null;
  if (!sidebarType) {
    return (
      <CollapsedContentWrapper>
        <CollapsedContentButtons column />
      </CollapsedContentWrapper>
    );
  }

  return (
    <>
      <SidebarComponentRenderer type={sidebarType} />
      <CollapsedContentButtons column />
    </>
  );
});

/** Sidebar logic to route between "comments" and "formSpy" */
const SidebarComponentRenderer = memo(({ type }) => {
  switch (type) {
    case loanDrilldownSidebarTypes.FILE_PREVIEW:
      return <DrilldownFilePreviewSidebar />;
    case loanDrilldownSidebarTypes.FILE_UPLOAD:
      return <DrilldownFileUploadSidebar />;
    case loanDrilldownSidebarTypes.FORMSPY:
      return <DrilldownSidebarFormSpy />;
    case loanDrilldownSidebarTypes.COMMENTS:
      return <DrilldownSidebarComments />;
    case loanDrilldownSidebarTypes.UW_NOTES:
      return <DrilldownSidebarUnderwritingNotes />;
    case loanDrilldownSidebarTypes.UW_CHECKLIST:
      return <DrilldownSidebarUnderwritingChecklist />;

    case loanDrilldownSidebarTypes.ADD_BORROWER:
      return <DrilldownSidebarAddBorrower />;
    case loanDrilldownSidebarTypes.LOAN_TOTALS:
      return <DrilldownSidebarLoanTotals />;
    case loanDrilldownSidebarTypes.ADD_EXCEPTION:
      return <DrilldownSidebarAddException />;
    case loanDrilldownSidebarTypes.ADD_PROPERTY:
      return <DrilldownSidebarAddProperty />;
    default:
      return null;
  }
});

const CollapsedContentWrapper = ({ children }) => {
  const styles = useMemo(() => {
    return {
      borderLeft: "1px solid #e0e0e0",
      height: "100%",
      display: "flex",
      background: "#ffffff",
      flexDirection: "column",
      gap: 1,
      flexShrink: 0,
      overflowY: "auto",
      ".MuiSvgIcon-root": { fontSize: 24 },
    };
  }, []);
  return (
    <Box sx={styles}>
      <Flx column>{children}</Flx>
    </Box>
  );
};

const CollapsedContentButtons = ({ column }) => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  return (
    <CollapsedContentWrapper column={column}>
      <CollapsedSiderbarButton
        type={loanDrilldownSidebarTypes.COMMENTS}
        tooltip="View Comments"
      >
        <Badge badgeContent={size(loanDrilldown?.comments)} color="primary">
          <QuestionAnswerOutlined className="thin" />
        </Badge>
      </CollapsedSiderbarButton>
      <CollapsedSiderbarButton
        type={loanDrilldownSidebarTypes.UW_NOTES}
        tooltip="View Underwriting Notes"
      >
        <NoteAltOutlined className="thin" />
      </CollapsedSiderbarButton>
      <CollapsedSiderbarButton
        type={loanDrilldownSidebarTypes.UW_CHECKLIST}
        tooltip="View Underwriting Checklist"
      >
        <ChecklistOutlined className="thin" />
      </CollapsedSiderbarButton>
      <CollapsedSiderbarButton
        type={loanDrilldownSidebarTypes.LOAN_TOTALS}
        tooltip="View Loan Totals"
      >
        <CalculateOutlined className="thin" />
      </CollapsedSiderbarButton>
      <CollapsedSiderbarButton
        type={loanDrilldownSidebarTypes.FORMSPY}
        tooltip="View Loan Data"
      >
        <CodeOutlined className="thin" />
      </CollapsedSiderbarButton>
      {/* <CollapsedSiderbarButton
        type={loanDrilldownSidebarTypes.FORMSPY}
        tooltip="Sidebar Options"
      >
        <MoreVertRounded className="thin" />
      </CollapsedSiderbarButton> */}
    </CollapsedContentWrapper>
  );
};
const CollapsedSiderbarButton = ({ type, children, tooltip }) => {
  const isActive = useSelector((state) => state.sidebar?.type === type);

  const isOpen = useSelector(
    (state) => state.sidebar?.type === loanDrilldownSidebarTypes.COMMENTS
  );
  const dispatch = useDispatch();
  const theme = useTheme();
  return (
    <Tooltip title={tooltip} placement={"left"} disableInteractive>
      <IconButton
        onClick={() => dispatch(sidebarTypeToggle(type))}
        size="large"
        color={isActive ? "primary" : "initial"}
        sx={{
          borderRadius: "0px",
          width: "52px",
          // width: "58px",
          background: isActive ? blue[50] : "transparent",
          height: "72px",
          // borderRadius: isActive ? "0px" : "50px",
          borderLeft: isActive
            ? `3px solid ${theme.palette.primary.main}`
            : "none",
        }}
      >
        {children}
      </IconButton>
    </Tooltip>
  );
};

export default LoanDrilldownScreenSidebar;
