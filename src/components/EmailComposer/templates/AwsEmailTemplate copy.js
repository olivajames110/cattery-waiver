import { Head, Html, Preview } from "@react-email/components";
import React from "react";

const AwsEmailTemplate = ({ props }) => {
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "";
  return (
    <>
      <Html>
        <Head />
        <Preview>AWS Email Verification</Preview>
        {/* <Body style={main}>
          <Container style={container}>
            <Section style={coverSection}>
              <Section style={imageSection}>
                <Img src={`${baseUrl}/static/aws-logo.png`} width="75" height="45" alt="AWS's Logo" />
              </Section>
              <Section style={upperSection}>
                <EmailTitle>Verify your email address</EmailTitle>
                <Text style={mainText}>
                  Thanks for starting the new AWS account creation process. We want to make sure it's really you. Please
                  enter the following verification code when prompted. If you don&apos;t want to create an account, you
                  can ignore this message.
                </Text>
                <Section style={verificationSection}>
                  <Text style={verifyText}>Verification code</Text>

                  <Text style={validityText}>(This code is valid for 10 minutes)</Text>
                </Section>
              </Section>
              <Hr />
              <Section style={lowerSection}>
                <Text style={cautionText}>
                  Amazon Web Services will never email you and ask you to disclose or verify your password, credit card,
                  or banking account number.
                </Text>
              </Section>
            </Section>
            <Text style={footerText}>
              This message was produced and distributed by Amazon Web Services, Inc., 410 Terry Ave. North, Seattle, WA
              98109. © 2022, Amazon Web Services, Inc.. All rights reserved. AWS is a registered trademark of{" "}
              <Link href="https://amazon.com" target="_blank" style={link}>
                Amazon.com
              </Link>
              , Inc. View our{" "}
              <Link href="https://amazon.com" target="_blank" style={link}>
                privacy policy
              </Link>
              .
            </Text>
          </Container>
        </Body> */}
      </Html>
    </>
  );
};

export default AwsEmailTemplate;
