import { Button } from "@mui/material";
import { isFunction, isNil } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { selectOptionsLoanStatus } from "../../constants/selectOptions/selectOptionsLoanStatus";
import { useUnderwritingHook } from "../../hooks/useUnderwritingHook";
import { loanPipelineClear } from "../../redux/actions/loanPipelineActions";
import SelectInput from "../inputs/SelectInput";
import InputWrapper from "../inputs/shared/InputWrapper";
import Flx from "../layout/Flx";
import BasicModal from "../modals/BasicModal";
import Txt from "../typography/Txt";
import DateInput from "../inputs/DateInput";
import DollarInput from "../inputs/DollarInput";
import TextInput from "../inputs/TextInput";
import { loanDrilldownClear } from "../../redux/actions/loanDrilldownActions";

const UpdateLoanDataModal = ({
  loan,
  field,
  onClose,
  inputLabel,
  type,
  onSuccessFn,
}) => {
  const { loading, updateLoanData, updateMilestoneStatus } =
    useUnderwritingHook();
  const dispatch = useDispatch();
  const [newValue, setNewValue] = useState(null);
  // const { getUserPipeline } = usePipelineHook();

  const handleOnClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const onUpdateClick = () => {
    const loanId = loan?._id;
    // dispatch(loanPipelineClear());
    // handleOnClose();
    // return;
    if (field === "loanStatus") {
      updateMilestoneStatus({
        loanId: loanId,
        loanStatus: newValue,
        onSuccessFn: (res) => {
          // dispatch(loanDrilldownClear());
          dispatch(loanPipelineClear());
          if (isFunction(onSuccessFn)) {
            onSuccessFn(res);
          }
          handleOnClose();
        },
      });
      return;
    }

    updateLoanData({
      loanId: loanId,
      data: { [field]: newValue },
      onSuccessFn: (res) => {
        dispatch(loanPipelineClear());
        if (isFunction(onSuccessFn)) {
          onSuccessFn(res);
        }
        handleOnClose();
      },
    });
  };

  useEffect(() => {
    setNewValue(loan?.[field] || null);
  }, [loan]);

  const modalTitle = useMemo(() => {
    const submitButtonText = {
      loanStatus: "Update Loan Status",
      expectedClosingDate: "Update Expected Closing Date",
      baseLoanAmount: "Update Base Loan Amount",
      loanName: "Update Loan Name",
    };

    return submitButtonText[field] || "Update Loan";
  }, [field]);
  if (isNil(loan)) {
    return;
  }

  return (
    <BasicModal
      show={!isNil(loan)}
      title={modalTitle}
      onClose={handleOnClose}
      maxWidth={"xs"}
    >
      <Flx column gap={3}>
        <Flx column>
          <Txt>Loan Name:</Txt>
          <Txt bold>{loan?.loanName || loan?.loanNumber}</Txt>
        </Flx>

        {field === "loanStatus" ? (
          <LoanStatusContent value={newValue} onChange={setNewValue} />
        ) : null}
        {field === "expectedClosingDate" ? (
          <LoanDataDateUpdate
            label={"Expected Closing Date"}
            value={newValue}
            onChange={setNewValue}
          />
        ) : null}
        {field === "baseLoanAmount" ? (
          <LoanDataDollarUpdate
            label="Base Loan Amount"
            value={newValue}
            onChange={setNewValue}
          />
        ) : null}
        {type === "text" ? (
          <InputWrapper label={inputLabel}>
            <TextInput value={newValue} onChange={setNewValue} />
          </InputWrapper>
        ) : null}

        <Flx fw end>
          <Button loading={loading} onClick={onUpdateClick}>
            Update Loan
          </Button>
        </Flx>
      </Flx>
    </BasicModal>
  );
};

const LoanStatusContent = ({ value, onChange }) => {
  return (
    <InputWrapper label={"Loan Status"}>
      <SelectInput
        value={value}
        onChange={onChange}
        options={selectOptionsLoanStatus}
      />
    </InputWrapper>
  );
};

const LoanDataDateUpdate = ({ label, value, onChange }) => {
  return (
    <InputWrapper label={label}>
      <DateInput value={value} onChange={onChange} />
    </InputWrapper>
  );
};
const LoanDataDollarUpdate = ({ label, value, onChange }) => {
  return (
    <InputWrapper label={label}>
      <DollarInput value={value} onChange={onChange} />
    </InputWrapper>
  );
};
export default UpdateLoanDataModal;
