import {
  AddRounded,
  CloseRounded,
  FormatListBulleted,
  ImageOutlined,
  TextFormat,
} from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  SpeedDial,
  SpeedDialAction,
  TextField,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { Column, Head, Html, Preview, Row } from "@react-email/components";
import React, { useMemo, useState } from "react";

import EmailBody from "./components/EmailBody";
import EmailDivider from "./components/EmailDivider";
import EmailEditingWrapper from "./components/EmailEditingWrapper";
import EmailImage from "./components/EmailImage";
import EmailLink from "./components/EmailLink";
import EmailList from "./components/EmailList";
import EmailSection from "./components/EmailSection";
import EmailSectionContent from "./components/EmailSectionContent";

import { get, isArray, isObject, isString } from "lodash";
import Flx from "../layout/Flx";
import Htag from "../typography/Htag";
import EmailTextPrimary from "./components/EmailTextPrimary";
import { emailBuilderTypes } from "./config/emailBuilderTypes";

const EmailBuilderTemplateRender = ({
  emailData,
  setEmailData,
  editingMode,
}) => {
  // const [emailData, setEmailData] = useState(data);

  const [selectedEditing, setSelectedEditing] = useState(null);

  // const handleUpdateEmailData = ({ newValue, originalValue }) => {
  //   console.log({ newValue, originalValue, emailData });
  //   const emailDataUpdated = {}; //emailData updated with newValue
  //   // console.log("newValue", { newValue, emailData, selectedEditing });
  //   console.log("emailDataUpdated", emailDataUpdated);
  //   setEmailData(emailDataUpdated);
  // };

  const handleUpdateEmailData = ({ newValue, originalValue }) => {
    setEmailData((prevEmailData) => {
      // Create a shallow copy of the previous emailData
      const updatedEmailData = { ...prevEmailData };

      // Map through the sections to find and update the matching content
      updatedEmailData.sections = prevEmailData.sections.map((section) => {
        if (
          section.type === "EmailTextPrimary" &&
          section.content === originalValue
        ) {
          return { ...section, content: newValue };
        }
        return section;
      });

      console.log("emailDataUpdated", updatedEmailData);
      return updatedEmailData;
    });
    setSelectedEditing(null);
  };
  const onCancelEditing = () => {
    setSelectedEditing(null);
    return;
  };

  if (selectedEditing) {
    return (
      <Flx
        sx={{
          overflow: "hidden",
          html: {
            flexGrow: 1,
          },
        }}
      >
        <Box
          sx={{
            overflowY: "auto",
            flexGrow: 1,
            position: "relative",
            p: 2,
            pb: 0.5,
            pt: 0.5,
          }}
        >
          <RendererContent
            editingMode
            data={emailData}
            setSelectedEditing={setSelectedEditing}
          />
        </Box>
        {selectedEditing ? (
          <EditingPane
            onUpdate={handleUpdateEmailData}
            onCancel={onCancelEditing}
            data={selectedEditing}
          />
        ) : null}
      </Flx>
    );
  }
  return (
    <Box
      sx={{
        overflowY: "auto",
        flexGrow: 1,
        position: "relative",
        p: 2,
        pb: 0.5,
        pt: 0.5,
      }}
    >
      {editingMode ? <EditingSpeedDial /> : null}
      <RendererContent
        data={emailData}
        editingMode={editingMode}
        setSelectedEditing={setSelectedEditing}
      />
      ;
    </Box>
  );
};

const RendererContent = ({ data, setSelectedEditing, editingMode }) => {
  // const [emailData, setEmailData] = useState(data);

  const handleOnDelete = (d) => {
    setSelectedEditing(d);
  };

  const handleOnSelect = (d) => {
    console.log("handleOnSelect", d);
    setSelectedEditing(d);
  };

  const emailData = useMemo(() => data, [data]);

  return (
    <Html>
      <Head />
      <Preview>Flatiron Follow Up Email</Preview>
      <EmailBody>
        <EmailSection>
          {emailData?.sections.map((section, i) => {
            switch (section.type) {
              case emailBuilderTypes.EmailTextPrimary:
                return (
                  <EmailEditingWrapper
                    editingMode={editingMode}
                    onDelete={handleOnDelete}
                    onSelect={handleOnSelect}
                    data={section}
                    key={i}
                  >
                    <EmailTextPrimary>{section.content}</EmailTextPrimary>
                  </EmailEditingWrapper>
                );

              case emailBuilderTypes.EmailList:
                return (
                  <EmailEditingWrapper
                    editingMode={editingMode}
                    onDelete={handleOnDelete}
                    onSelect={handleOnSelect}
                    data={section}
                    key={i}
                  >
                    <EmailList
                      key={i}
                      title={section.title}
                      list={section.items}
                    />
                  </EmailEditingWrapper>
                );
              default:
                return null;
            }
          })}
        </EmailSection>
        <EmailSignature data={emailData?.signature} />
      </EmailBody>
    </Html>
  );
};

const EditingPane = ({ data, onUpdate, onCancel }) => {
  // console.log("DATA", data);
  const [value, setValue] = useState(data?.content);
  const handleOnChange = (v) => {
    setValue(v);
  };
  const handleOnUpdate = () => {
    // console.log("UPDATE,", value);
    onUpdate({ newValue: value, originalValue: data?.content });
    // value(v);
  };
  return (
    <Flx
      column
      sx={{
        // position: "absolute",
        // top: 0,
        // right: 0,
        // height: "100%",
        // width: "600px",
        width: "540px",
        border: `1px solid ${grey[300]}`,
        // width: "100%",
        p: 2,
        zIndex: 223456,
        gap: 1,
        background: grey[100],
        // background: "red",
      }}
    >
      <Flx jb ac fw>
        <Htag h3>Edit Field</Htag>
        <IconButton size="small" onClick={onCancel}>
          <CloseRounded />
        </IconButton>
      </Flx>
      <TextareaInput value={value} onChange={handleOnChange} multiline={12} />
      <Flx end sx={{ mt: 2 }}>
        <Button onClick={handleOnUpdate}>Update</Button>
      </Flx>
    </Flx>
  );
};

const TextareaInput = ({
  value,
  onChange,
  fullWidth = true,
  sx,
  size = "medium",
  placeholder,
  multiline,
  inputParams,
}) => {
  const styles = useMemo(() => {
    if (multiline) {
      return {
        // padding: 0,
        // textarea: {
        //   padding: "10px 12px",
        // },
        ...sx,
      };
    }
    return {
      ...sx,
    };
  }, [sx, multiline]);
  return (
    <TextField
      // value={val}
      className="basic-input"
      value={value ?? ""}
      // variant="basic"
      onChange={(e) => onChange(e?.target?.value)}
      placeholder={placeholder}
      size={size}
      fullWidth={fullWidth}
      sx={styles}
      multiline={multiline}
      {...inputParams}
    />
  );
};

const EditingSpeedDial = ({ props }) => {
  const actions = [
    { icon: <ImageOutlined />, name: "Image" },
    { icon: <FormatListBulleted />, name: "List" },
    { icon: <TextFormat />, name: "Textbox" },
  ];

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
          zIndex: 422345,
          ".MuiButtonBase-root": {
            width: "48px",
            height: "48px",
            padding: 0,
          },
        }}
        icon={<AddRounded sx={{ fontSize: "24px" }} />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={handleClose}
          />
        ))}
      </SpeedDial>
    </>
  );
};

const EmailSignature = ({ props }) => {
  return (
    <EmailSection>
      <EmailSectionContent suppressHoriztonalPadding>
        <Row>
          <Column style={{ width: "180px" }}>
            <EmailImage
              width={"150"}
              height={"150"}
              src={
                "https://media.licdn.com/dms/image/v2/C4E0BAQHGJOmc_jS8HA/company-logo_200_200/company-logo_200_200/0/1659372156556/flatiron_realty_capital_logo?e=2147483647&v=beta&t=Y_31uPKujyKYyixPtTt9c5k32z5KAjlSSSjKZeLldGg"
              }
            />
          </Column>
          <Column>
            <EmailTextPrimary suppressMargin bold>
              James Oliva
            </EmailTextPrimary>
            <EmailTextPrimary suppressMargin>
              Account Executive
            </EmailTextPrimary>
            <EmailTextPrimary suppressMargin>
              Flatiron Realty Capital
            </EmailTextPrimary>

            <EmailSectionContent
              paddingTop="8px"
              paddingBottom={"8px"}
              suppressHoriztonalPadding
            >
              <EmailDivider />
            </EmailSectionContent>
            <EmailLink
              style={{ display: "block" }}
              href={"tel: (631) 456-3373"}
            >
              (631) 456-3373
            </EmailLink>
            <EmailLink
              style={{ display: "block" }}
              href={"mailto: jo@flatironrealtycapital.com "}
            >
              jo@flatironrealtycapital.com
            </EmailLink>
            <EmailLink
              style={{ display: "block" }}
              href={"https://flatironrealtycapital.com/"}
            >
              Visit our website
            </EmailLink>
          </Column>
        </Row>
      </EmailSectionContent>
    </EmailSection>
  );
};
export default EmailBuilderTemplateRender;
