import React, { useCallback, useMemo, useRef, useState } from "react";
import Flx from "../../layout/Flx";
import { grey } from "@mui/material/colors";
import HtmlTextEditor from "../../inputs/HtmlTextEditor";
import {
  Button,
  Card,
  Chip,
  ClickAwayListener,
  Grow,
  IconButton,
  Paper,
  Popper,
  Tooltip,
} from "@mui/material";
import {
  AddOutlined,
  AttachFileOutlined,
  CloseOutlined,
  CommentOutlined,
  HouseOutlined,
  PersonOutline,
} from "@mui/icons-material";
import { isArray, isEmpty, isFunction, isNil } from "lodash";
import SelectInput from "@mui/material/Select/SelectInput";
import InputWrapper from "../../inputs/shared/InputWrapper";
import Txt from "../../typography/Txt";
import { formatDateShort } from "../../../utils/dates/formatDateShort";
import { useDispatch } from "react-redux";
import { useUnderwritingHook } from "../../../hooks/useUnderwritingHook";
import { loanDrilldownSet } from "../../../redux/actions/loanDrilldownActions";
import { loanPipelineClear } from "../../../redux/actions/loanPipelineActions";

const onSuccessActionEnums = {
  LOAN_DRILLDOWN: "loanDrilldown",
  LOAN_PIPELINE: "loanPipeline",
};
const LoanCommentTextBox = ({ loan, onSuccessfn, onSuccessAction }) => {
  const [comment, setComment] = useState(null);
  const { createDealComment, loading } = useUnderwritingHook();
  const dispatch = useDispatch();

  const showCommentFooter = useMemo(() => {
    if (isNil(comment)) {
      return false;
    }

    if (comment?.plainText?.trim()) {
      return true;
    }
    return false;
  }, [comment]);

  const onSubmit = () => {
    createDealComment({
      loanId: loan?._id,
      data: {
        htmlString: comment?.htmlString,
      },
      onSuccessFn: (response) => {
        if (isFunction(onSuccessfn)) {
          onSuccessfn(response);
        }

        if (onSuccessAction === onSuccessActionEnums.LOAN_DRILLDOWN) {
          dispatch(loanDrilldownSet(response));
          return;
        }

        if (onSuccessAction === onSuccessActionEnums.LOAN_PIPELINE) {
          dispatch(loanPipelineClear(response));
          return;
        }

        dispatch(loanDrilldownSet(response));
        dispatch(loanPipelineClear(response));
        setComment("");
      },
    });
  };

  return (
    <Flx
      column
      fw
      gap={1}
      sx={{
        px: 1,
      }}
    >
      <HtmlTextEditor
        value={comment}
        onChange={setComment}
        placeholder="Start typing to add new comment..."
      />
      {showCommentFooter ? (
        <Flx
          wrap
          gap={1}
          end
          // jb
          // ac
          fw
          sx={{ borderBottom: `1px solid ${grey[300]}`, pb: 2, mb: 2 }}
        >
          {/* <LoanAssociationOptions /> */}

          <Button loading={loading} onClick={onSubmit} size="small">
            Submit
          </Button>
        </Flx>
      ) : null}
    </Flx>
  );
};

const LoanAssociationOptions = () => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const [associations, setAssociations] = useState([]);

  const handleToggle = (e) => {
    console.log("open→", !open, "anchor:", buttonRef.current);
    setOpen((prev) => !prev);
  };

  const handleClose = (event) => {
    if (buttonRef.current?.contains(event.target)) return;
    setOpen(false);
  };

  const onAssociationAdd = useCallback((obj) => {
    setAssociations((prev) => [...prev, obj]);
    setOpen(false);
  }, []);

  const onAssociationDelete = useCallback(
    (obj) => setAssociations((prev) => prev.filter((a) => a !== obj)),
    []
  );

  //   return <Box />;

  return (
    <Flx wrap sx={{ flexGrow: 0 }}>
      <Flx gap={0.5} ac wrap>
        <AssociationsChipRenderer
          associations={associations}
          onDelete={onAssociationDelete}
        />

        <Button
          ref={buttonRef}
          variant="text"
          color="inherit"
          sx={{ color: grey[600], fontWeight: 400 }}
          endIcon={<AddOutlined className="thin" />}
          size="small"
          onClick={handleToggle}
        >
          Tag Comment
        </Button>
      </Flx>

      <Popper
        open={open}
        anchorEl={buttonRef.current}
        placement="bottom"
        // modifiers={[{ name: "offset", options: { offset: [0, 6] } }]}
        transition
        sx={{ zIndex: 100 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: "top right" }}>
            <Paper elevation={3}>
              <ClickAwayListener onClickAway={handleClose}>
                {/* No more `show` prop here */}
                <AssociationSelector
                  onAdd={onAssociationAdd}
                  closePopper={() => setOpen(false)}
                />
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Flx>
  );
};

const AssociationSelector = ({ loan, closePopper, onAdd }) => {
  //   const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const [associationType, setAssociationType] = useState(null);
  const [associationValue, setAssociationValue] = useState(null);

  const commentAssociations = useMemo(() => {
    let asc = [];

    if (isArray(loan?.comments)) {
      asc.push({ label: "Comments", value: "comments" });
    }
    if (isArray(loan?.loanDocuments)) {
      asc.push({ label: "Loan Documents", value: "loanDocuments" });
    }
    if (isArray(loan?.borrowers)) {
      asc.push({ label: "Borrowers", value: "borrowers" });
    }
    if (isArray(loan?.properties)) {
      asc.push({ label: "Properties", value: "properties" });
    }

    return asc;
  }, [loan]);

  const associationValueOptions = useMemo(() => {
    if (associationType === "comments") {
      const comments = loan?.comments || [];
      const mappedComments = comments.map((comment) => ({
        optionLabel: `By ${comment?.postedBy} on ${formatDateShort(comment?.commentDateTime)}`,
        label: comment?.postedBy,
        value: comment?._id,
      }));
      return mappedComments;
    } else if (associationType === "loanDocuments") {
      const loanDocuments = loan?.loanDocuments || [];
      const mappedDocuments = loanDocuments.map((doc) => ({
        optionLabel: doc?.file_display_name,
        label: doc?.file_display_name,
        value: doc?._id,
      }));
      return mappedDocuments;
    } else if (associationType === "borrowers") {
      const borrowers = loan?.borrowers || [];

      const mappedBorrowers = borrowers.map((borrower) => ({
        optionLabel: `${borrower?.firstName} ${borrower?.lastName}`,
        label: `${borrower?.firstName} ${borrower?.lastName}`,
        value: borrower?._id,
      }));
      return mappedBorrowers;
    } else if (associationType === "properties") {
      const subjectProperties = loan?.subjectProperties || [];
      const mappedSubjectProperties = subjectProperties.map((property) => ({
        optionLabel: `${property?.address?.streetNumber} ${property?.address?.streetAddress}`,
        label: `${property?.address?.streetNumber} ${property?.address?.streetAddress}`,
        value: property?._id,
      }));
      return mappedSubjectProperties;
    }
  }, [associationType, loan]);

  const onTypeChange = useCallback(
    (id, fullOption) => {
      onAdd({
        type: associationType,
        label: fullOption?.optionLabel,
        _id: id,
      });
      setAssociationValue(null);
      setAssociationType(null);
    },
    [associationType]
  );

  const handleClosePopper = useCallback((props) => {
    setAssociationType(null);
    setAssociationValue(null);
    closePopper();
  }, []);

  // if (!show) {
  //   return null;
  // }
  return (
    <Card sx={{ p: 2 }} column fw gap={1}>
      <Flx column g={2}>
        <Flx fw jb ac>
          <Txt bold>Tag Comment To:</Txt>
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            size="small"
            onClick={handleClosePopper}
          >
            <CloseOutlined />
          </IconButton>
        </Flx>
        <InputWrapper label="Select Category">
          <SelectInput
            value={associationType}
            onChange={setAssociationType}
            options={commentAssociations}
          />
        </InputWrapper>
        <InputWrapper label="Select Category Value">
          <SelectInput
            disabled={isNil(associationType)}
            value={associationValue}
            onChange={onTypeChange}
            options={associationValueOptions}
          />
        </InputWrapper>
      </Flx>
    </Card>
  );
};

const AssociationsChipRenderer = ({ associations, onDelete }) => {
  if (isEmpty(associations)) {
    return null;
  }
  return associations?.map((asc) => {
    const iconMap = {
      comments: <CommentOutlined className="thin" />,
      loanDocuments: <AttachFileOutlined className="thin" />,
      borrowers: <PersonOutline className="thin" />,
      subjectProperties: <HouseOutlined className="thin" />,
    };
    return (
      <Tooltip disableInteractive title={asc.label} key={asc.value}>
        <Chip
          key={asc?.type}
          label={asc?.label}
          icon={iconMap[asc?.type]}
          onDelete={() => onDelete(asc)}
          sx={{
            maxWidth: "120px",
            ".MuiSvgIcon-root": {
              fontSize: 15,
            },
          }}
        />
      </Tooltip>
    );
  });
};
export default LoanCommentTextBox;
