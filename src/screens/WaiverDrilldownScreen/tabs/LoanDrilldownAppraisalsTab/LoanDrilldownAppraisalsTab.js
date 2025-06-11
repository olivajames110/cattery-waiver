import { PersonAddOutlined } from "@mui/icons-material";
import { Divider, IconButton, Tooltip } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import AgButtonToggleSidebarColumns from "../../../../components/agGrid/AgButtonToggleSidebarColumns";
import AgButtonToggleSidebarFilters from "../../../../components/agGrid/AgButtonToggleSidebarFilters";
import Flx from "../../../../components/layout/Flx";
import TableClickthroughSection from "../../shared/TableClickthroughSection";
import LoanDrilldownTabPanel from "../LoanDrilldownTabPanel";
import AppraisalPreviewCard from "./AppraisalPreviewCard";
import LoanAppraisalsTable from "./LoanAppraisalsTable";

const LoanDrilldownAppraisalsTab = ({ value, tab }) => {
  const [selected, setSelected] = useState(null);
  const ref = useRef();
  const [quickFilter, setQuickFilter] = useState(null);
  const appraisals = useSelector(
    (state) => state?.loanDrilldown?.appraisals || []
  );

  const handleOnRowClicked = useCallback(
    (d) => {
      setSelected(d);
    },
    [setSelected]
  );

  const handleCloseDrilldown = useCallback(() => {
    setSelected(null);
  }, []);

  useEffect(() => {
    if (selected) {
      setSelected(null);
    }
  }, [tab]);

  return (
    <LoanDrilldownTabPanel value={value} tab={tab}>
      <TableClickthroughSection
        title={"Appraisals"}
        quickFilter={quickFilter}
        setQuickFilter={setQuickFilter}
        // endContent={
        //   <Flx ac>
        //     <AgButtonToggleSidebarColumns icon ref={ref} />
        //     <AgButtonToggleSidebarFilters icon ref={ref} />
        //     <Divider flexItem sx={{ m: 1 }} orientation="vertical" />
        //     {/* <CreateBorrowerButton /> */}
        //   </Flx>
        // }
      >
        <LoanAppraisalsTable
          rowData={appraisals}
          ref={ref}
          onRowClicked={handleOnRowClicked}
          selected={selected}
          quickFilterText={quickFilter}
        />
      </TableClickthroughSection>
      <AppraisalPreviewCard
        selected={selected}
        onClose={handleCloseDrilldown}
      />
    </LoanDrilldownTabPanel>
  );
};

const CreateBorrowerButton = ({ onClick }) => {
  return (
    <Tooltip arrow title="Add New Borrower">
      <IconButton color="primary" onClick={onClick}>
        <PersonAddOutlined />
      </IconButton>
    </Tooltip>
  );
};

export default LoanDrilldownAppraisalsTab;
