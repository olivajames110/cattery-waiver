import { PeopleOutlineOutlined, PersonAddOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import { memo, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Flx from "../../../../components/layout/Flx";
import ScreenContent from "../../../../components/layout/ScreenContent";
import TitledCard from "../../../../components/ui/TitledCard";
import { loanDrilldownSidebarTypes } from "../../../../constants/enums/loanDrilldownScreenSidebarOptions";
import { sidebarTypeToggle } from "../../../../redux/actions/sidebarActions";
import LoanDocumentGroupFilesCard from "../../shared/LoanDocumentGroupFilesCard";
import TableClickthroughSection from "../../shared/TableClickthroughSection";
import LoanDrilldownTabPanel from "../LoanDrilldownTabPanel";
import BorrowerPreview from "./BorrowerPreview";
import LoanBorrowersTable from "./LoanBorrowersTable";
import { grey } from "@mui/material/colors";

const LoanDrilldownBorrowersTab = ({ value, tab }) => {
  const ref = useRef();
  const { borrowerId } = useParams();

  const [quickFilter, setQuickFilter] = useState(null);

  const borrowers = useSelector(
    (state) => state?.loanDrilldown?.borrowers || []
  );

  // Find the selected borrower based on URL parameter
  const selectedBorrower = useMemo(() => {
    if (!borrowerId || !borrowers.length) return null;
    return borrowers.find((borrower) => borrower._id === borrowerId) || null;
  }, [borrowerId, borrowers]);

  return (
    <LoanDrilldownTabPanel>
      <TableClickthroughSection
        title={"Borrowers"}
        quickFilter={quickFilter}
        setQuickFilter={setQuickFilter}
        endContent={<AddBorrowerButton />}
      />
      <ScreenContent>
        <Flx fw gap={2} wrap>
          <Flx column sx={{ flexGrow: 1, flexBasis: "880px", flexShrink: 0 }}>
            <TitledCard
              variant="h3"
              title={"Loan Borrowers"}
              fw
              grow={0}
              bodySx={{ px: 0, pb: 0 }}
              icon={<PeopleOutlineOutlined className="thin" />}
            >
              <Flx sx={{ borderTop: `1px solid ${grey[200]}` }}>
                <LoanBorrowersTable
                  rowData={borrowers}
                  ref={ref}
                  selectedId={selectedBorrower?._id}
                  quickFilterText={quickFilter}
                />
                <BorrowerPreview selectedId={selectedBorrower?._id} />
              </Flx>
            </TitledCard>
          </Flx>
          <LoanDocumentGroupFilesCard
            docGroup={"Borrower Documents"}
            title={"All Borrower Files"}
          />
        </Flx>
      </ScreenContent>
    </LoanDrilldownTabPanel>
  );
};

const AddBorrowerButton = memo(() => {
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(sidebarTypeToggle(loanDrilldownSidebarTypes.ADD_BORROWER));
  };

  return (
    <Button
      sx={{ ml: 1 }}
      startIcon={<PersonAddOutlined />}
      onClick={handleToggle}
    >
      Add Borrower
    </Button>
  );
});

export default LoanDrilldownBorrowersTab;
