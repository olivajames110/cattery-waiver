import { Head, Html, Preview } from "@react-email/components";
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

const AwsEmailTemplate = ({ props }) => {
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "";
  return (
    <>
      <Html>
        <Head />
        <Preview>AWS Email Verification</Preview>
        <EmailBody>
          <EmailContainer style={container}>
            <EmailSection style={coverSection}>
              <EmailSectionContent center style={imageSection}>
                <EmailImage
                  src={"https://flatironrealtycapital.com/wp-content/uploads/2022/06/Logoo-copy-300x94.png"}
                  width="147"
                  height="46"
                  alt="Flatiron Logo"
                />
              </EmailSectionContent>
              <EmailSectionContent>
                <EmailTitle>Verify your email address</EmailTitle>
                <EmailTextPrimary>
                  Thanks for starting the new AWS account creation process. We want to make sure it's really you. Please
                  enter the following verification code when prompted. If you don&apos;t want to create an account, you
                  can ignore this message.
                </EmailTextPrimary>
                <EmailSection>
                  <EmailTextPrimary bold center suppressMargin>
                    Verification code
                  </EmailTextPrimary>

                  <EmailTextPrimary center suppressMargin>
                    (This code is valid for 10 minutes)
                  </EmailTextPrimary>
                </EmailSection>
              </EmailSectionContent>
              <EmailDivider />
              <EmailSectionContent>
                <EmailTextPrimary suppressMargin>
                  Amazon Web Services will never email you and ask you to disclose or verify your password, credit card,
                  or banking account number.
                </EmailTextPrimary>
              </EmailSectionContent>
            </EmailSection>
            <EmailTextFooter>
              This message was produced and distributed by Amazon Web Services, Inc., 410 Terry Ave. North, Seattle, WA
              98109. © 2022, Amazon Web Services, Inc.. All rights reserved. AWS is a registered trademark of{" "}
              <EmailLink href="https://amazon.com">Amazon.com</EmailLink>, Inc. View our{" "}
              <EmailLink href="https://amazon.com">privacy policy</EmailLink>.
            </EmailTextFooter>
          </EmailContainer>
        </EmailBody>
      </Html>
    </>
  );
};
const container = {
  padding: "20px",
  margin: "0 auto",
  backgroundColor: "#eee",
};

const imageSection = {
  backgroundColor: "#252f3d",
  // display: "flex",
  padding: "20px 0",
  // alignItems: "center",
  // justifyContent: "center",
};
const coverSection = { backgroundColor: "#fff" };
export default AwsEmailTemplate;
