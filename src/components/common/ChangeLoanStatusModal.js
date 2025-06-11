import { isNil, set } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectOptionsLoanStatus } from "../../constants/selectOptions/selectOptionsLoanStatus";
import { usePipelineHook } from "../../hooks/usePipelineHook";
import SelectInput from "../inputs/SelectInput";
import InputWrapper from "../inputs/shared/InputWrapper";
import BasicModal from "../modals/BasicModal";
import Flx from "../layout/Flx";
import { Button } from "@mui/material";
import Txt from "../typography/Txt";
import { useUnderwritingHook } from "../../hooks/useUnderwritingHook";
import { loanPipelineClear } from "../../redux/actions/loanPipelineActions";

const ChangeLoanStatusModal = ({ loan, onClose }) => {
  const { loading, updateLoanData, updateMilestoneStatus } =
    useUnderwritingHook();
  const dispatch = useDispatch();
  const [status, setStatus] = useState(null);
  // const { getUserPipeline } = usePipelineHook();

  const handleOnClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const onUpdateClick = () => {
    const loanId = loan?._id;
    updateMilestoneStatus({
      loanId: loanId,
      loanStatus: status,
      onSuccessFn: (res) => {
        dispatch(loanPipelineClear());
        handleOnClose();
      },
    });
  };

  useEffect(() => {
    setStatus(loan?.loanStatus || null);
  }, [loan]);

  if (isNil(loan)) {
    return;
  }

  return (
    <BasicModal
      show={!isNil(loan)}
      title={"Update Loan Status"}
      onClose={handleOnClose}
      maxWidth={"xs"}
    >
      <Flx column gap={3}>
        <Flx column>
          <Txt>Loan Name:</Txt>
          <Txt bold>{loan?.loanName || loan?.loanNumber}</Txt>
        </Flx>

        <InputWrapper label={"Loan Status"}>
          <SelectInput
            value={status}
            onChange={setStatus}
            options={selectOptionsLoanStatus}
          />
        </InputWrapper>
        <Flx fw end>
          <Button loading={loading} onClick={onUpdateClick}>
            Update Loan Status
          </Button>
        </Flx>
      </Flx>
    </BasicModal>
  );
};
export default ChangeLoanStatusModal;
