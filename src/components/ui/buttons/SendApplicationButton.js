import {
  CheckRounded,
  CopyAll,
  OpenInNew,
  SendRounded,
} from "@mui/icons-material";
import { Box, Button, Divider, IconButton, Tooltip } from "@mui/material";
import { green, grey } from "@mui/material/colors";
import { isFunction, isNil } from "lodash";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useBorrowerSubmissionsHook } from "../../../hooks/useBorrowerSubmissionsHook";
import SelectToggleInput from "../../inputs/SelectToggleInput";
import InputWrapper from "../../inputs/shared/InputWrapper";

import BasicModal from "../../modals/BasicModal";
import Txt from "../../typography/Txt";
import Flx from "../../layout/Flx";

const SendApplicationButton = ({
  children,
  href,
  modalTitle = "Send Url",
  urlText = "URL",
  show,
  onClose,
}) => {
  const [localShow, setLocalShow] = useState(false);

  const [creditAuthUrl, setCreditAuthUrl] = useState(null);
  const [loanAppUrl, setLoanAppUrl] = useState(null);

  const handleOnClose = () => {
    setCreditAuthUrl(null);
    setLoanAppUrl(null);
    if (isFunction(onClose)) {
      onClose();
    }
    setLocalShow(false);
  };

  return (
    <>
      <BasicModal
        size="md"
        // bodySx={{ width: "100%" }}
        // fullWidth
        autoWidth={isNil(creditAuthUrl) && isNil(loanAppUrl)}
        title={"Generate Application Links"}
        show={localShow || show}
        onClose={handleOnClose}
      >
        <BorrowerSelectLinkGeneration
          setCreditAuthUrl={setCreditAuthUrl}
          setLoanAppUrl={setLoanAppUrl}
        />
        {isNil(creditAuthUrl) && isNil(loanAppUrl) ? null : (
          <>
            <Divider sx={{ mt: 4 }} />
            <Flx column gap={6} sx={{ mt: 1, py: 2, px: 1 }}>
              <UrlCopyAndPaste
                url={loanAppUrl}
                urlText={"Loan Application Url"}
              />
              <UrlCopyAndPaste
                url={creditAuthUrl}
                urlText={"Credit Authorization Url"}
              />
            </Flx>
          </>
        )}
      </BasicModal>
      <Button
        variant="outlined"
        endIcon={<SendRounded />}
        onClick={() => setLocalShow(true)}
      >
        Send Borrower Applications
        {/* {children} */}
      </Button>
    </>
  );
};

const UrlCopyAndPaste = ({ url, urlText }) => {
  const [copied, setCopied] = useState(false);
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
  };
  const handleSendEmail = () => {
    const subject = encodeURIComponent("ResiLender Loan Application");
    const body = encodeURIComponent(
      `Hello, below is the link for our loan application. Please visit the url and fill out the form:\n\n` +
        `${url}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };
  if (!url) {
    return null;
  }

  return (
    <Flx gap={1.5}>
      <Flx fw column gap={1}>
        <Flx fw jb ac gap={1} sx={{ mt: 1 }}>
          <Flx column>
            <Txt sx={{ fontSize: "13px" }} bold>
              {urlText}
            </Txt>
            <Txt sx={{ fontSize: "11px" }}>
              This URL includes metadata that tracks the submission for this
              user. Please do not modify.
            </Txt>
          </Flx>
          <Flx jb ac>
            <Tooltip title="Open in new tab" arrow>
              <IconButton
                role="link"
                href={url}
                color="primary"
                target="_blank"

                // onClick={handleCopyToClipboard}
              >
                <OpenInNew />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={copied ? "Copied To Clipboard" : "Copy To Clipboard"}
              arrow
            >
              <IconButton
                role="link"
                color={copied ? "success" : "primary"}
                onClick={handleCopyToClipboard}
                sx={{ background: copied ? green[50] : "inherit" }}
              >
                {copied ? <CheckRounded /> : <CopyAll />}
              </IconButton>
            </Tooltip>
            {/* <Divider orientation="vertical" flexItem sx={{ m: 0.5, mr: 2 }} />
            <Button startIcon={<EmailOutlined />} onClick={handleSendEmail}>
              Send Email
            </Button> */}
          </Flx>
        </Flx>
        <Box
          sx={{
            p: 1,
            background: grey[100],
            overflow: "hidden",

            position: "relative",
            display: "inline-block",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <Txt sx={{ fontSize: "12px", textOverflow: "ellipsis" }}>{url}</Txt>
        </Box>
      </Flx>
    </Flx>
  );
};

const BorrowerSelectLinkGeneration = ({ setCreditAuthUrl, setLoanAppUrl }) => {
  const applicationTypesEnums = {
    LOAN_APP: "Loan Application",
    CREDIT_AUTH: "Credit Authorization",
    BOTH: "Both",
  };
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const borrowers = useMemo(() => loanDrilldown?.borrowers, [loanDrilldown]);

  const [selectedBorrowerId, setSelectedBorrowerId] = useState(null);
  const [applicationType, setApplicationType] = useState(null);

  const { loading, generateDealApplicationLink, generateDealCreditAuthLink } =
    useBorrowerSubmissionsHook();

  const borrowerOptions = useMemo(() => {
    return borrowers?.map((b) => ({
      label: `${b?.firstName} ${b?.lastName}`,
      value: b?._id,
    }));
  }, [borrowers]);

  const applicationTypeOptions = useMemo(
    () => [
      applicationTypesEnums.LOAN_APP,
      applicationTypesEnums.CREDIT_AUTH,
      applicationTypesEnums.BOTH,
    ],
    []
  );

  const handleGenerateLinks = () => {
    const selectedBorrowerData = borrowers?.find(
      (b) => b?._id === selectedBorrowerId
    );

    if (
      applicationType === applicationTypesEnums.BOTH ||
      applicationType === applicationTypesEnums.LOAN_APP
    ) {
      // setLoanAppUrl(
      //   "https://loportal.resilender.com/loan-application?link_id=68011e296b339abcf211fcac&link_type=app"
      // );
      generateDealApplicationLink({
        loanId: loanDrilldown?._id,
        borrowerData: selectedBorrowerData,
        onSuccessFn: (d) => {
          setLoanAppUrl(d?.link);
        },
      });
    }
    if (
      applicationType === applicationTypesEnums.BOTH ||
      applicationType === applicationTypesEnums.CREDIT_AUTH
    ) {
      // setCreditAuthUrl(
      //   "https://loportal.resilender.com/credit-auth?link_id=68011e296b339abcf211fcab&link_type=auth"
      // );
      generateDealCreditAuthLink({
        loanId: loanDrilldown?._id,
        borrowerData: selectedBorrowerData,
        onSuccessFn: (d) => {
          setCreditAuthUrl(d?.link);
        },
      });
    }
  };

  return (
    <Flx fw column gap={3} jb>
      <Flx gap={8}>
        <InputWrapper label="Select Borrower" sx={{ minWidth: "300px" }}>
          <SelectToggleInput
            value={selectedBorrowerId}
            onChange={setSelectedBorrowerId}
            options={borrowerOptions}
            placeholder="Select Borrower"
          />
        </InputWrapper>
        <InputWrapper label="Choose Application Type">
          <SelectToggleInput
            value={applicationType}
            onChange={setApplicationType}
            options={applicationTypeOptions}
            placeholder="Select Borrower"
          />
        </InputWrapper>
      </Flx>
      <Flx end fw>
        <Button
          variant="contained"
          loading={loading}
          disabled={
            loading || isNil(selectedBorrowerId) || isNil(applicationType)
          }
          endIcon={<SendRounded />}
          onClick={handleGenerateLinks}
        >
          {applicationType === applicationTypesEnums.BOTH
            ? "Generate Links"
            : "Generate Link"}
        </Button>
      </Flx>
    </Flx>
  );
};
export default SendApplicationButton;
