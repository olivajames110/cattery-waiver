import { memo } from "react";
import { useSelector } from "react-redux";
import CommentItemRenderer from "../../../../_src_shared/comments/CommentItemRenderer";
import LoanCommentTextBox from "../../../../components/common/Loan/LoanCommentTextBox";
import DrilldownSidebarPane from "../DrilldownSidebarPane";

const DrilldownSidebarComments = memo(() => {
  const loan = useSelector((state) => state.loanDrilldown);

  return (
    <DrilldownSidebarPane title="Comments" bodyPadding={0}>
      <LoanCommentTextBox loan={loan} />

      <CommentItemRenderer px={2} comments={loan?.comments} />
    </DrilldownSidebarPane>
  );
});

export default DrilldownSidebarComments;
