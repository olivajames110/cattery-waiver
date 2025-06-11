import { isBoolean, isEmpty, isFunction, isNil } from "lodash";
import React, { useEffect } from "react";
import ScreenContent from "../layout/ScreenContent";
import { blue, grey } from "@mui/material/colors";
import { Box, Card, Container, IconButton } from "@mui/material";
import Flx from "../layout/Flx";
import Htag from "../typography/Htag";
import { CloseRounded, CodeOutlined } from "@mui/icons-material";
import SearchInputLight from "../inputs/SearchInputLight";

const TablePreviewCard = ({
  title,
  children,
  onClose,
  icon,
  formSpy,
  setFormSpy,
  quickFilter,
  setQuickFilter,
  searchPlaceholder,
  bodySx,
  bodyStartContent,
}) => {
  return (
    <OuterBackground>
      <PreviewCard>
        <Header>
          <Flx fw jb ac>
            <Flx gap={1} ac>
              {icon}
              <Htag>{title}</Htag>
            </Flx>
            <Flx>
              {isBoolean(formSpy) ? (
                <IconButton
                  color={formSpy ? "primary" : "default"}
                  onClick={() => setFormSpy((s) => !s)}
                >
                  <CodeOutlined />
                </IconButton>
              ) : null}
              {isFunction(onClose) ? (
                <IconButton onClick={onClose}>
                  <CloseRounded />
                </IconButton>
              ) : null}
            </Flx>
          </Flx>
          {isFunction(setQuickFilter) ? (
            <SearchInputLight
              fullWidth={false}
              value={quickFilter}
              placeholder={searchPlaceholder}
              onChange={setQuickFilter}
            />
          ) : null}
        </Header>
        {bodyStartContent}
        <Body bodySx={bodySx}>{children}</Body>
      </PreviewCard>
    </OuterBackground>
  );
};

const Header = ({ children }) => {
  return (
    <ScreenContent
      sx={{
        p: 0,
        borderBottom: `1px solid ${grey[200]}`,
        pb: 0.5,
      }}
    >
      {children}
    </ScreenContent>
  );
};

const Body = ({ bodySx, children }) => {
  return (
    <ScreenContent
      sx={{
        // pt: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        // gap: 6,
        ...bodySx,
      }}
    >
      {children}
    </ScreenContent>
  );
};

const PreviewCard = ({ children }) => {
  return (
    <Card
      sx={
        {
          // borderLeft: `4px solid ${blue[100]}`,
        }
      }
    >
      {children}
    </Card>
  );
};

const OuterBackground = ({ children }) => {
  return (
    <Box
      sx={{
        // pl: 4,
        // m: 1,
        p: 2,
        borderRadius: 0,
        // pr: 4,
        // pb: 8,
        // mx: 2,
        // border: "8px solid #ffffff",
        // background: "#ddeffd",
        // background: "#e3f2fd",
        // background: "#e3f2fd",
        // borderLeft: `6px solid ${blue[100]}`,
        // borderTopRightRadius: "8px",
        // borderBottomRightRadius: "8px",
        background: "#eff7fe",
        // border: `4px solid #ddeffd`,
        borderLeft: `4px solid #ddeffd`,
        // borderLeft: `1px solid #ddeffd`,
        flexGrow: 1,
        flexShrink: 0,
        width: "100%",
        flexBasis: "1000px",
        // flexBasis: "1200px",
        // flexBasis: "100%",
        // borderTop: `1px solid ${grey[200]}`,
        minHeight: "70vh",
      }}
    >
      <ScreenContent
        suppressPaddingLeftRight
        // sx={{
        //   // pl: 4,
        //   // m: 1,
        //   borderRadius: 1,
        //   // pr: 4,
        //   // pb: 8,
        //   // mx: 2,
        //   // border: "8px solid #ffffff",
        //   // background: "#ddeffd",
        //   // background: "#e3f2fd",
        //   // background: "#e3f2fd",
        //   // borderLeft: `6px solid ${blue[100]}`,
        //   borderTopRightRadius: "8px",
        //   borderBottomRightRadius: "8px",
        //   background: "#eff7fe",
        //   // border: `4px solid #ddeffd`,
        //   borderLeft: `1px solid #ddeffd`,
        //   // borderLeft: `1px solid #ddeffd`,
        //   flexGrow: 1,
        //   // borderTop: `1px solid ${grey[200]}`,
        //   minHeight: "70vh",
        // }}
      >
        <Container maxWidth={"xl"}>{children}</Container>
      </ScreenContent>
    </Box>
  );
};
export default TablePreviewCard;
