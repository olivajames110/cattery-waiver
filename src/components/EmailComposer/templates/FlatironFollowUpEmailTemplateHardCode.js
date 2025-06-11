import { Column, Head, Html, Preview, Row } from "@react-email/components";
import React from "react";
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

const FlatironFollowUpEmailTemplateHardCode = ({ props }) => {
  return (
    <Html>
      <Head />
      <Preview>Flatiron Follow Up Email</Preview>
      <EmailBody>
        <EmailSection>
          {/* <EmailTitle>Verify your email address</EmailTitle> */}
          <EmailTextPrimary>Hello James,</EmailTextPrimary>
          <EmailTextPrimary>
            Hope all is well! It's been a while since we last spoke and I wanted to follow up with you and see if you
            had anything going on I can help fund? I'd love to help with your client's or your next project.
          </EmailTextPrimary>
          <EmailTextPrimary>See below for our lending terms and documentation necessary</EmailTextPrimary>
          <EmailList
            title="12 Month Fix & Flip/Bridge Loan Parameters"
            list={[
              "Loan to Cost: Up to 85%",
              "Rehab/Reno Financing: Up to 100%",
              "Interest Rates: Starting at 10.99%",
              "Lending Term: 1 Year With a 4-Month Minimum",
              "Closing Time: As Fast as 24 Hours With Clear Title & Appraisal",
              "Amortization: Interest-Only",
              "Minimum Credit Score: 660 FICO",
              "Foreclosure/Bailouts (Case by Case)",
              "Mid-Construction Jobs are Financeable",
            ]}
          />
          <EmailList
            title="30 Year Rental Investment Parameters"
            list={[
              "Loan to Value: Up to 75%",
              "Interest Rates: Starting at 7.25%",
              "Lending Term: 30-Year Fixed-Rate",
              "Closing Time: 14 Business Days",
              "Amortization: Principal & Interest",
              "Minimum Credit Score: 660 FICO",
            ]}
          />
          <EmailList
            title="Ground up Construction Parameters"
            list={[
              "Lending Term: 12-18 Month Bridge Loan",
              "Loan to Cost: Up to 65% on land with approved plans, Up to 70% of your construction budget",
              "Interest Rates: Starting at 10.99%",
              "Amortization: Interest-Only",
            ]}
          />
        </EmailSection>
        <EmailTextPrimary>
          Look forward to hearing from you soon. If you have any questions or scenarios feel free to reach me on my
          personal cell.
        </EmailTextPrimary>
        <EmailSignature />
      </EmailBody>
    </Html>
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
            <EmailTextPrimary suppressMargin>Account Executive</EmailTextPrimary>
            <EmailTextPrimary suppressMargin>Flatiron Realty Capital</EmailTextPrimary>

            {/* /// */}
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
export default FlatironFollowUpEmailTemplateHardCode;
