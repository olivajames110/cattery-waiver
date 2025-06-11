import { Button } from "@mui/material";
import React, { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HtmlTextEditor from "../../../../components/inputs/HtmlTextEditor";
import Flx from "../../../../components/layout/Flx";
import { useUnderwritingHook } from "../../../../hooks/useUnderwritingHook";
import { loanDrilldownSet } from "../../../../redux/actions/loanDrilldownActions";
import { sidebarClear } from "../../../../redux/actions/sidebarActions";
import DrilldownSidebarPane from "../DrilldownSidebarPane";
import LoanDrilldownChecklistTab from "../../tabs/LoanDrilldownChecklistTab/LoanDrilldownChecklistTab";

const DrilldownSidebarUnderwritingChecklist = memo(() => {
  const loan = useSelector((state) => state.loanDrilldown);
  const { createLoanException, loading } = useUnderwritingHook();
  const dispatch = useDispatch();
  const onSubmit = (values) => {
    // createBorrower({
    //   loanId: loan?._id,
    //   borrower: values,
    //   onSuccessFn: (response) => {
    //     dispatch(loanDrilldownSet(response));
    //     dispatch(sidebarClear());
    //   },
    // });

    createLoanException({
      loanId: loan?._id,
      data: values,
      onSuccessFn: (response) => {
        dispatch(loanDrilldownSet(response));
        dispatch(sidebarClear());
      },
    });
  };

  return (
    <DrilldownSidebarPane
      title="Underwriting Checklist"
      // maxWidth="40vw"
      // initialWidth={"700px"}
      bodyPadding={0}
      // variant="fixed"
    >
      <LoanDrilldownChecklistTab includedInSidebar />
    </DrilldownSidebarPane>
  );
});

const Notepad = memo(() => {
  const loan = useSelector((state) => state.loanDrilldown);
  const [comment, setComment] = useState(null);
  const { createDealComment, loading } = useUnderwritingHook();
  const dispatch = useDispatch();
  const onSubmit = () => {
    createDealComment({
      loanId: loan?._id,
      data: {
        // content: comment?.htmlString,
        htmlString: comment?.htmlString,
      },
      onSuccessFn: (response) => {
        dispatch(loanDrilldownSet(response));
        setComment(null);
        // dispatch(sidebarClear());
      },
    });
  };

  return (
    <Flx column fw gap={1}>
      {/* <HtmlTextEditor
        value={{ html: text }}
        onChange={setComment}
        // onChange={(val) => setText(val?.plainText ?? "")}
        placeholder="Add a new comment..."
      /> */}
      <HtmlTextEditor
        value={comment}
        onChange={setComment}
        placeholder="Add a new comment..."
      />
      <Flx fw end>
        {comment?.plainText?.trim() && (
          <Button loading={loading} onClick={onSubmit} size="small">
            Submit
          </Button>
        )}
      </Flx>
    </Flx>
  );
});

export default DrilldownSidebarUnderwritingChecklist;
