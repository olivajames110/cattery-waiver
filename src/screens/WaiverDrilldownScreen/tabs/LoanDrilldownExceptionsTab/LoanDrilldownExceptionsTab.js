import { EditNoteOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import { memo, useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loanDrilldownSidebarTypes } from "../../../../constants/enums/loanDrilldownScreenSidebarOptions";
import { sidebarTypeToggle } from "../../../../redux/actions/sidebarActions";
import TableClickthroughSection from "../../shared/TableClickthroughSection";
import LoanDrilldownTabPanel from "../LoanDrilldownTabPanel";
import ExceptionPreviewCard from "./ExceptionPreviewCard";
import LoanExceptionsTable from "./LoanExceptionsTable";

const LoanDrilldownExceptionsTab = ({ value, tab }) => {
  const [selected, setSelected] = useState(null);
  const ref = useRef();
  const [quickFilter, setQuickFilter] = useState(null);
  const loanExceptions = useSelector(
    (state) => state?.loanDrilldown?.exceptions || []
  );

  const handleCloseDrilldown = useCallback(() => {
    setSelected(null);
  }, []);

  const handleOnRowClicked = useCallback(
    (d) => {
      setSelected(d);
    },
    [setSelected]
  );

  return (
    <LoanDrilldownTabPanel value={value} tab={tab}>
      <TableClickthroughSection
        title={"Loan Exceptions"}
        quickFilter={quickFilter}
        setQuickFilter={setQuickFilter}
        endContent={<AddExceptionButton />}
      >
        <LoanExceptionsTable
          rowData={loanExceptions}
          ref={ref}
          onRowClicked={handleOnRowClicked}
          selected={selected}
          quickFilterText={quickFilter}
        />
      </TableClickthroughSection>
      <ExceptionPreviewCard
        // selected={selected}
        selectedId={selected?._id}
        onClose={handleCloseDrilldown}
      />
    </LoanDrilldownTabPanel>
  );
};
const AddExceptionButton = memo(() => {
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(sidebarTypeToggle(loanDrilldownSidebarTypes.ADD_EXCEPTION));
  };

  return (
    <Button
      sx={{ ml: 1 }}
      startIcon={<EditNoteOutlined />}
      onClick={handleToggle}
    >
      Add Exception
    </Button>
  );
});
export default LoanDrilldownExceptionsTab;
