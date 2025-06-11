import { CloseOutlined } from "@mui/icons-material";
import { Backdrop, Button, IconButton } from "@mui/material";
import { isEmpty, isNil } from "lodash";
import React, { memo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommentItemRenderer from "../../../../_src_shared/comments/CommentItemRenderer";
import HtmlTextEditor from "../../../../components/inputs/HtmlTextEditor";
import Flx from "../../../../components/layout/Flx";
import TitledCard from "../../../../components/ui/TitledCard";
import { useUnderwritingHook } from "../../../../hooks/useUnderwritingHook";
import { loanDrilldownSet } from "../../../../redux/actions/loanDrilldownActions";
import LoanFilePreview from "../../tabs/LoanDrilldownFilesTab/LoanFilePreview";
import DrilldownSidebarPane from "../DrilldownSidebarPane";
import { useLoanFilesHook } from "../../../../hooks/useLoanFilesHook";

const DrilldownFilePreviewSidebar = memo(() => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const fileObject = useSelector((state) => state.sidebar?.state);
  const [fileComments, setFileComments] = useState(null);

  const handleShowComments = useCallback(
    (associatedCommentIds) => {
      // console.log("loanDrilldown", { loanDrilldown, associatedCommentIds });
      if (isEmpty(associatedCommentIds)) {
        setFileComments([]);
        return;
      }
      const comments = loanDrilldown?.comments || [];
      const associatedComments = comments.filter((comment) =>
        associatedCommentIds.includes(comment._id)
      );
      // console.log("associatedComments", associatedComments);

      setFileComments(associatedComments);
    },
    [loanDrilldown, setFileComments]
  );

  const handleHideComments = useCallback((props) => {
    setFileComments(null);
  }, []);
  return (
    <>
      <DrilldownSidebarPane
        // fixedWidth="640px"
        title="File Preview"
        // variant="fixed"
        onClose={handleHideComments}
        bodyPadding={0}
        initialWidth="36vw"
        bodyOverflow="hidden"
      >
        <LoanFilePreview
          fileObject={fileObject}
          onShowCommentsClick={handleShowComments}
        />
        <CommentThreadFloatingPane
          fileObject={fileObject}
          fileComments={fileComments}
          onClose={handleHideComments}
        />
      </DrilldownSidebarPane>
      <Backdrop
        open={!isNil(fileComments)}
        //
        sx={{ zIndex: 10000 }}
      />
    </>
  );
});

const CommentThreadFloatingPane = ({ fileComments, fileObject, onClose }) => {
  if (isNil(fileComments)) {
    return;
  }

  const width = 660;

  return (
    <>
      <TitledCard
        title={"Comments"}
        cardSx={{
          // background: "red",
          position: "fixed",
          top: "24px",
          // left: "-514px",
          right: `${width}px`,
          height: "calc(100% - 48px)",
          width: "580px",
          overflowY: "auto",
          zIndex: 1000,
        }}
        headerEndContent={
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              position: "absolute",
              top: 3,
              right: 3,
              width: 30,
              height: 30,
            }}
          >
            <CloseOutlined />
          </IconButton>
        }
      >
        <AddLoanCommentEditor
          fileObject={fileObject}
          // associatedCommentIds={associatedCommentIds}
          // cancelComment={handleCancelComment}
        />
        <CommentItemRenderer comments={fileComments} />
      </TitledCard>
    </>
  );
};

const AddLoanCommentEditor = ({ fileObject }) => {
  const loan = useSelector((state) => state.loanDrilldown);
  const [comment, setComment] = useState(null);
  const { createDealComment, loading } = useUnderwritingHook();
  const { updateLoanDocMetadata } = useLoanFilesHook();
  const dispatch = useDispatch();

  const onSubmit = () => {
    if (!comment?.plainText?.trim()) return;

    console.log("comment", { comment, fileObject });

    // updateLoanDocMetadata({
    //   loanId: loan?._id,
    //   data: [
    //     {
    //       _id: fileObject?._id,
    //       associations: null,
    //       // associations: [
    //       //   {
    //       //     entityType: "comments",
    //       //     entityId: "67f8251fb1a091224ecb366f",
    //       //   },
    //       // ],
    //     },
    //   ],
    //   onSuccessFn: (data) => {
    //     dispatch(loanDrilldownSet(data));
    //     // onReset();
    //   },
    // });
    // return;
    return;
    createDealComment({
      loanId: loan?._id,
      data: {
        htmlString: comment.htmlString,
        associations: [
          {
            entityType: "loanDocument",
            entityId: fileObject?._id,
          },
        ],
      },
      // testing: true,
      onSuccessFn: (response) => {
        dispatch(loanDrilldownSet(response));
        setComment(null);
        // cancelComment();
      },
    });
  };

  return (
    <Flx
      column
      fw
      center
      gap={1}
      sx={{
        position: "relative",
        mb: 2,
        background: "#fff",
      }}
    >
      <HtmlTextEditor
        value={comment}
        onChange={setComment}
        placeholder="Add a new comment..."
        maxHeight="100px"
      />
      <Flx fw end>
        {comment?.plainText?.trim() && (
          <Button disabled={loading} onClick={onSubmit} size="small">
            Submit
          </Button>
        )}
      </Flx>
    </Flx>
  );
};
export default DrilldownFilePreviewSidebar;
