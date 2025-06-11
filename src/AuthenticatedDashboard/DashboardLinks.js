import {
  AccountBalanceOutlined,
  ArticleOutlined,
  CreditScoreOutlined,
  DocumentScannerOutlined,
  PersonOutline,
  ScienceOutlined,
  UploadFileOutlined,
} from "@mui/icons-material";
import { Box, Divider } from "@mui/material";
import React from "react";
import PermissionsGate from "../authentication/PermissionsGate";
import Flx from "../components/layout/Flx";
import NavLinkLogoutButton from "./NavLinkLogoutButton";
import LinkListGroup from "./components/LinkListGroup";
import LinkListItem from "./components/LinkListItem";

// Helper function for consistent item styles (both normal links & dropdown toggles)

// --------------------------------
// Core Dashboard Links Component
// --------------------------------
const DashboardLinks = ({ collapsed }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <PrimaryLinks collapsed={collapsed} />
      <SecondaryLinks collapsed={collapsed} />
    </Box>
  );
};

const PrimaryLinks = ({ collapsed }) => {
  return (
    <Flx
      column
      sx={
        {
          // paddingTop: "15px",
          //
        }
      }
    >
      {/* <LinkListGroup collapsed={collapsed}>
        <LinkListItem
          collapsed={collapsed}
          icon={<HomeOutlined />}
          to="/"
          label="Dashboard"
        />
      </LinkListGroup>
      <Divider /> */}
      <LinkListGroup collapsed={collapsed} title={"Pipelines"}>
        <LinkListItem
          collapsed={collapsed}
          icon={<ArticleOutlined />}
          to="/loans"
          label="Loan Pipeline"
        />
        <LinkListItem
          collapsed={collapsed}
          icon={<AccountBalanceOutlined />}
          to="/loan-applications"
          label="Loan Applications"
        />
        <LinkListItem
          collapsed={collapsed}
          icon={<CreditScoreOutlined />}
          to="/credit-authorizations"
          label="Credit Authorizations"
        />
      </LinkListGroup>

      <Divider />

      {/* <LinkListGroup collapsed={collapsed} title={"Loan Information"}>
        <LinkDropdown
          collapsed={collapsed}
          icon={<MapsHomeWorkOutlined />}
          label="Properties"
        >
          <LinkListItem
            collapsed={collapsed}
            icon={<HolidayVillageOutlined />}
            to="/properties"
            label="View All Properties"
          />
          <LinkListItem
            collapsed={collapsed}
            icon={<AddBusinessOutlined />}
            to="/borrowers/credit-reports"
            label="Create Property"
          />
        </LinkDropdown>
        <LinkDropdown
          collapsed={collapsed}
          icon={<PeopleOutline />}
          label="Borrowers"
        >
          <LinkListItem
            collapsed={collapsed}
            icon={<ContactsOutlined />}
            to="/borrowers"
            label="View All Borrowers"
          />
          <LinkListItem
            collapsed={collapsed}
            icon={<ArticleOutlined />}
            to="/borrowers/credit-reports"
            label="View Credit Reports"
          />
          <LinkListItem
            collapsed={collapsed}
            icon={<ContactMailOutlined />}
            to="/borrowers/credit-reports"
            label="Request Credit Report"
          />
        </LinkDropdown>
        <LinkDropdown
          collapsed={collapsed}
          icon={<FactCheckOutlined />}
          label="Appraisals"
        >
          <LinkListItem
            collapsed={collapsed}
            icon={<FactCheckRounded />}
            to="/appraisals/view"
            label="View Appraisals"
          />
          <LinkListItem
            collapsed={collapsed}
            icon={<NoteAddOutlined />}
            to="/appraisals/order"
            label="Order Appraisal"
          />
        </LinkDropdown>
      </LinkListGroup> */}
    </Flx>
  );
};
const SecondaryLinks = ({ collapsed }) => {
  return (
    <Flx column>
      <Divider />
      <LinkListGroup collapsed={collapsed} title={"Resources"}>
        <PermissionsGate permission={"admin"}>
          <LinkListItem
            collapsed={collapsed}
            icon={<ScienceOutlined />}
            to="/testing"
            label="Dev Endpoint Testing"
          />
        </PermissionsGate>
        {/* {process.env.NODE_ENV !== "production" ? (
          <LinkListItem
            collapsed={collapsed}
            icon={<ScienceOutlined />}
            to="/testing"
            label="Dev Endpoint Testing"
          />
        ) : null} */}
        <LinkListItem
          collapsed={collapsed}
          icon={<DocumentScannerOutlined />}
          to="/guidelines"
          label="Guidelines"
        />
        <LinkListItem
          collapsed={collapsed}
          icon={<UploadFileOutlined />}
          to="/file-upload"
          label="File Upload"
        />
        <LinkListItem
          collapsed={collapsed}
          icon={<PersonOutline />}
          to="/profile"
          label="Profile"
        />
      </LinkListGroup>
      <Divider />
      <LinkListGroup collapsed={collapsed}>
        <NavLinkLogoutButton collapsed={collapsed} />
      </LinkListGroup>
    </Flx>
  );
};

export default DashboardLinks;
