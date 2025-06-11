import { AddBusinessOutlined, HouseOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import { memo, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Flx from "../../../../components/layout/Flx";
import ScreenContent from "../../../../components/layout/ScreenContent";
import TitledCard from "../../../../components/ui/TitledCard";
import { loanDrilldownSidebarTypes } from "../../../../constants/enums/loanDrilldownScreenSidebarOptions";
import { sidebarTypeToggle } from "../../../../redux/actions/sidebarActions";
import TableClickthroughSection from "../../shared/TableClickthroughSection";
import LoanDrilldownTabPanel from "../LoanDrilldownTabPanel";
import LoanPropertiesTable from "./LoanPropertiesTable";
import PropertyDrilldown from "./PropertyDrilldown";
import LoanDocumentGroupFilesCard from "../../shared/LoanDocumentGroupFilesCard";
import Txt from "../../../../components/typography/Txt";
import { grey } from "@mui/material/colors";

const LoanDrilldownPropertiesTab = ({ value, tab }) => {
  const { propertyId, id: loanId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const properties = loanDrilldown?.subjectProperties || [];
  const ref = useRef();

  const [quickFilter, setQuickFilter] = useState(null);

  // Find the selected property based on URL parameter
  const selectedProperty = useMemo(() => {
    if (!propertyId || !properties.length) return null;
    return properties.find((property) => property._id === propertyId) || null;
  }, [propertyId, properties]);

  return (
    <LoanDrilldownTabPanel value={value} tab={tab}>
      <TableClickthroughSection
        title={"Properties"}
        quickFilter={quickFilter}
        setQuickFilter={setQuickFilter}
        endContent={<AddPropertyButton />}
      >
        <ScreenContent>
          <Flx fw wrap gap={2}>
            <Flx sx={{ flexGrow: 1, flexBasis: "880px", flexShrink: 0 }}>
              <TitledCard
                variant="h3"
                title={"Loan Properties"}
                fw
                grow={0}
                cardSx={{
                  flexBasis: "280px",
                  flexShrink: 0,
                  flexGrow: 1,
                  height: "auto",
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                }}
                bodySx={{ px: 0, pb: 0 }}
                icon={<HouseOutlined className="thin" />}
              >
                <Flx sx={{ borderTop: `1px solid ${grey[200]}` }}>
                  <LoanPropertiesTable
                    rowData={properties}
                    ref={ref}
                    selectedId={selectedProperty?._id}
                    quickFilterText={quickFilter}
                    showAllColumns={false}
                  />
                  {/* <PropertyDrilldown selectedId={selectedProperty?._id} /> */}
                  <PropertyDrilldown selectedId={selectedProperty?._id} />
                </Flx>
              </TitledCard>
            </Flx>
            <Flx fw column gap={1} sx={{ flexGrow: 0, mt: 2, flexShrink: 0 }}>
              {/* <Txt bold>Loan Documents</Txt> */}
              <Flx
                wrap
                gap={2}
                sx={{ flexBasis: "580px", flexShrink: 1, flexGrow: 1 }}
              >
                <LoanDocumentGroupFilesCard
                  sx={{ flexGrow: 1, flexBasis: "300px" }}
                  showGroupIcon
                  // showIfEmpty
                  docGroup={"Property Documents"}
                />
                <LoanDocumentGroupFilesCard
                  sx={{ flexGrow: 1, flexBasis: "300px" }}
                  showGroupIcon
                  // showIfEmpty
                  docGroup={"Appraisal"}
                />
                <LoanDocumentGroupFilesCard
                  sx={{ flexGrow: 1, flexBasis: "300px" }}
                  showGroupIcon
                  // showIfEmpty
                  docGroup={"Construction Documents"}
                />
                <LoanDocumentGroupFilesCard
                  sx={{ flexGrow: 1, flexBasis: "300px" }}
                  showGroupIcon
                  // showIfEmpty
                  docGroup={"Insurance Docs"}
                />
                <LoanDocumentGroupFilesCard
                  sx={{ flexGrow: 1, flexBasis: "300px" }}
                  showGroupIcon
                  // showIfEmpty
                  docGroup={"Title Docs"}
                />
                <LoanDocumentGroupFilesCard
                  sx={{ flexGrow: 1, flexBasis: "300px" }}
                  showGroupIcon
                  // showIfEmpty
                  docGroup={"Leases & Rents"}
                />
              </Flx>
            </Flx>
          </Flx>
        </ScreenContent>
      </TableClickthroughSection>
    </LoanDrilldownTabPanel>
  );
};

const AddPropertyButton = memo(() => {
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(sidebarTypeToggle(loanDrilldownSidebarTypes.ADD_PROPERTY));
  };

  return (
    <Button
      sx={{ ml: 1 }}
      startIcon={<AddBusinessOutlined />}
      onClick={handleToggle}
    >
      Add Property
    </Button>
  );
});
export default LoanDrilldownPropertiesTab;
