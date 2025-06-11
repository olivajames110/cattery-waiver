import {
  AccountBalanceOutlined,
  AssessmentOutlined,
  AssignmentOutlined,
  BusinessOutlined,
  ConstructionOutlined,
  GavelOutlined,
  HelpOutlineOutlined,
  HomeOutlined,
  KeyOutlined,
  ListAltOutlined,
  PeopleOutlineOutlined,
  PersonOutline,
  QuestionMark,
  QuestionMarkRounded,
  ReportOutlined,
  ShieldOutlined,
  TitleOutlined,
} from "@mui/icons-material";
import Flx from "../../../components/layout/Flx";
import { grey } from "@mui/material/colors";

const LoanDocumentGroupIcon = ({ docGroup, styled, background, size }) => {
  const documentIconMap = {
    Appraisal: <AssessmentOutlined className="thin" />,
    "Borrower Documents": <PeopleOutlineOutlined className="thin" />,
    "Closing Package": <GavelOutlined className="thin" />,
    // "Closing Package": <ArchiveOutlined className="thin" />,
    "Construction Documents": <ConstructionOutlined className="thin" />,
    "Entity Docs": <BusinessOutlined className="thin" />,
    "Insurance Docs": <ShieldOutlined className="thin" />,
    Liquidity: <AccountBalanceOutlined className="thin" />,
    "Leases & Rents": <KeyOutlined className="thin-9" />,
    "Letter of Explanation & Exceptions": (
      <HelpOutlineOutlined className="thin" />
    ),
    "Property Documents": <HomeOutlined className="thin" />,
    Questionnaires: <AssignmentOutlined className="thin" />,
    "Terms & Sizer": <ListAltOutlined className="thin" />,
    "Third Party Reports": <ReportOutlined className="thin" />,
    "Title Docs": <TitleOutlined className="thin" />,
    undefined: <QuestionMarkRounded className="thin" />,
  };

  const returnValue = documentIconMap[docGroup] || (
    <PersonOutline className="thin" />
  );
  if (styled) {
    return (
      <StyledBox background={background} size={size}>
        {returnValue}
      </StyledBox>
    );
  }

  return returnValue;
};

const StyledBox = ({ children, background = grey[100], size = 40 }) => {
  return (
    <Flx
      center
      sx={{
        background: background,
        width: size,
        height: size,
        borderRadius: 1,
        flexGrow: 0,
        flexShrink: 0,
      }}
    >
      {children}
    </Flx>
  );
};
export default LoanDocumentGroupIcon;
