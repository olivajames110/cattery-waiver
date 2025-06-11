import { Column, Head, Html, Preview, Row } from "@react-email/components";
import React, { useState } from "react";
import EmailBody from "../components/EmailBody";
import EmailContainer from "../components/EmailContainer";
import EmailTextFooter from "../components/EmailTextFooter";
import EmailLink from "../components/EmailLink";
import EmailTextPrimary from "../components/EmailTextPrimary";
import EmailSection from "../components/EmailSection";
import EmailSectionContent from "../components/EmailSectionContent";
import EmailDivider from "../components/EmailDivider";
import EmailTitle from "../components/EmailTitle";
import EmailImage from "../components/EmailImage";
import EmailList from "../components/EmailList";
import { Box } from "@mui/material";
import { emailBuilderTypes } from "../config/emailBuilderTypes";

const FlatironFollowUpEmailTemplate = ({ data, editing }) => {
  const [emailData, setEmailData] = useState(data);
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
                  <EditingWrapper editing={editing} key={i}>
                    <EmailTextPrimary>{section.content}</EmailTextPrimary>
                  </EditingWrapper>
                );
              // return   <EmailTextPrimary key={i}>{section.content}</EmailTextPrimary>;
              case emailBuilderTypes.EmailList:
                return (
                  <EditingWrapper editing={editing} key={i}>
                    <EmailList key={i} title={section.title} list={section.items} />
                  </EditingWrapper>
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

const EditingWrapper = ({ editing, children }) => {
  if (editing) {
    return <Box>{children}</Box>;
  }
  return children;
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
            <EmailTextPrimary suppressMargin>Account Executive</EmailTextPrimary>
            <EmailTextPrimary suppressMargin>Flatiron Realty Capital</EmailTextPrimary>

            <EmailSectionContent paddingTop="8px" paddingBottom={"8px"} suppressHoriztonalPadding>
              <EmailDivider />
            </EmailSectionContent>
            <EmailLink style={{ display: "block" }} href={"tel: (631) 456-3373"}>
              (631) 456-3373
            </EmailLink>
            <EmailLink style={{ display: "block" }} href={"mailto: jo@flatironrealtycapital.com "}>
              jo@flatironrealtycapital.com
            </EmailLink>
            <EmailLink style={{ display: "block" }} href={"https://flatironrealtycapital.com/"}>
              Visit our website
            </EmailLink>
          </Column>
        </Row>
      </EmailSectionContent>
    </EmailSection>
  );
};
export default FlatironFollowUpEmailTemplate;
