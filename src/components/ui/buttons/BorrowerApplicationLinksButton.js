import {
  CheckRounded,
  CopyAll,
  CreditScoreRounded,
  OpenInNew,
  SendRounded,
  StoreOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { green, grey } from "@mui/material/colors";
import isFunction from "lodash/isFunction";
import isNil from "lodash/isNil";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import BasicModal from "../../modals/BasicModal";
import Flx from "../../layout/Flx";
import Txt from "../../typography/Txt";
import SelectUserEmailInput from "../../inputs/SelectUserEmailInput";
import { useBorrowerSubmissionsHook } from "../../../hooks/useBorrowerSubmissionsHook";
import TextInput from "../../inputs/TextInput";

const BorrowerApplicationLinksButton = ({ show, onClose }) => {
  const [localShow, setLocalShow] = useState(false);
  const user = useSelector((state) => state.user);
  const currentUserEmail = useMemo(() => user?.emailAddress, [user]);

  // parent‐tracked URLs just for autoWidth
  const [loanAppUrl, setLoanAppUrl] = useState(null);
  const [creditAuthUrl, setCreditAuthUrl] = useState(null);
  const [salespersonEmail, setSalespersonEmail] = useState(null);
  const [linkTagText, setLinkTagText] = useState(null);
  const [linkTag, setLinkTag] = useState(null);

  // Track if modal is actually open
  const isModalOpen = localShow || show;

  const handleOnClose = () => {
    setLoanAppUrl(null);
    setCreditAuthUrl(null);
    setLinkTagText(null);
    setLinkTag(null);
    setSalespersonEmail(currentUserEmail);
    if (isFunction(onClose)) onClose();
    setLocalShow(false);
  };

  const onBlur = (v) => {
    console.log("onBlur", v);
    setLinkTag(v?.target?.value);
  };

  // initialize once
  useEffect(() => {
    if (isNil(salespersonEmail)) {
      setSalespersonEmail(currentUserEmail);
    }
  }, [salespersonEmail, currentUserEmail]);

  return (
    <>
      <BasicModal
        size="md"
        autoWidth={isNil(loanAppUrl) && isNil(creditAuthUrl)}
        title="Generate Borrower Application Links"
        show={isModalOpen}
        onClose={handleOnClose}
      >
        <Flx column gap={6}>
          <Flx column gap={3}>
            <Flx column gap={0.5}>
              <Txt sx={{ fontSize: 13 }}>Select Salesperson Email</Txt>
              <SelectUserEmailInput
                displayFullLabel
                value={salespersonEmail}
                onChange={setSalespersonEmail}
              />
            </Flx>
            <Flx column gap={0.5}>
              <Txt sx={{ fontSize: 13 }}>
                Enter any details to track the application including a borrower
                name, email or subject property address
              </Txt>
              <TextInput
                value={linkTagText}
                onChange={setLinkTagText}
                onBlur={onBlur}
              />
            </Flx>
          </Flx>

          <Flx column gap={6}>
            <Divider sx={{ borderStyle: "dashed !important", mb: -2 }}>
              <Txt
                secondary
                center
                sx={{ fontStyle: "italic", fontSize: "12px" }}
              >
                The following will be assigned to <b>{salespersonEmail}</b> and
                include metadata for tracking — please do not modify.
              </Txt>
            </Divider>
            <LoanApplicationCopyPaste
              salespersonEmail={salespersonEmail}
              linkTag={linkTag}
              onLinkReady={setLoanAppUrl}
              isModalOpen={isModalOpen}
            />
            <CreditAuthCopyPaste
              salespersonEmail={salespersonEmail}
              linkTag={linkTag}
              onLinkReady={setCreditAuthUrl}
              isModalOpen={isModalOpen}
            />
          </Flx>
        </Flx>
      </BasicModal>

      <Button
        variant="outlined"
        endIcon={<SendRounded />}
        onClick={() => setLocalShow(true)}
      >
        Send Borrower Application Link
      </Button>
    </>
  );
};

const LoanApplicationCopyPaste = ({
  linkTag,
  salespersonEmail,
  onLinkReady,
  isModalOpen,
}) => {
  const [url, setUrl] = useState(null);
  const { generateLOApplicationLink } = useBorrowerSubmissionsHook();

  useEffect(() => {
    // Only run if modal is open
    if (!isModalOpen) return;

    // clear old and tell parent
    setUrl(null);
    onLinkReady(null);

    // re‐fetch for new salesperson
    generateLOApplicationLink({
      salesperson: salespersonEmail,
      linkTag,
      onSuccessFn: (d) => {
        setUrl(d.link);
        onLinkReady(d.link);
      },
    });
    // only re-run when the salesperson changes or modal opens
  }, [salespersonEmail, linkTag, isModalOpen]);

  return (
    <UrlCopyAndPaste
      icon={<StoreOutlined className="thin" />}
      url={url}
      urlText="Loan Application Url"
    />
  );
};

const CreditAuthCopyPaste = ({
  salespersonEmail,
  linkTag,
  onLinkReady,
  isModalOpen,
}) => {
  const [url, setUrl] = useState(null);
  const { generateLOCreditAuthLink } = useBorrowerSubmissionsHook();

  useEffect(() => {
    // Only run if modal is open
    if (!isModalOpen) return;

    setUrl(null);
    onLinkReady(null);

    generateLOCreditAuthLink({
      salesperson: salespersonEmail,
      linkTag,
      onSuccessFn: (d) => {
        setUrl(d.link);
        onLinkReady(d.link);
      },
    });
  }, [salespersonEmail, linkTag, isModalOpen]);

  return (
    <UrlCopyAndPaste
      icon={<CreditScoreRounded className="thin" />}
      url={url}
      urlText="Credit Authorization Url"
    />
  );
};

const UrlCopyAndPaste = ({ icon, url, urlText }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
  };

  return (
    <Flx fw ac gap={1.5}>
      <Flx fw column>
        <Flx fw jb ac>
          <Txt sx={{ fontSize: 13 }} bold>
            {urlText}
          </Txt>
          <Flx jb ac sx={{ ml: 2 }}>
            <Tooltip title="Open in new tab" arrow>
              <IconButton
                href={url}
                target="_blank"
                size="small"
                color="primary"
              >
                <OpenInNew />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={copied ? "Copied To Clipboard" : "Copy To Clipboard"}
              arrow
            >
              <IconButton
                onClick={handleCopy}
                size="small"
                color={copied ? "success" : "primary"}
                sx={{ background: copied ? green[50] : "inherit" }}
              >
                {copied ? <CheckRounded /> : <CopyAll />}
              </IconButton>
            </Tooltip>
          </Flx>
        </Flx>
        <Flx
          fw
          ac
          gap={1}
          sx={{ background: grey[100], px: 1, py: 1, borderRadius: 1 }}
        >
          {icon}
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "100%",
            }}
          >
            {isNil(url) ? (
              <Flx fw center>
                <CircularProgress size={20} />
              </Flx>
            ) : (
              <Txt sx={{ fontSize: 12 }}>{url}</Txt>
            )}
          </Box>
        </Flx>
      </Flx>
    </Flx>
  );
};

export default BorrowerApplicationLinksButton;
