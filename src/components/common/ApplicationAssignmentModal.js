import React, { useCallback, useMemo } from "react";
import { cachedDataItemSet } from "../../redux/actions/cachedDataActions";
import { isArray, isNil } from "lodash";
import BasicModal from "../modals/BasicModal";
import RffForm from "../finalForm/RffForm";
import RffGroup from "../finalForm/shared/RffGroup";
import RffSelectAutocompleteField from "../finalForm/inputs/RffSelectAutocompleteField";
import RffSelectUserEmailField from "../finalForm/inputs/RffSelectUserEmailField";
import { loanPipelineSet } from "../../redux/actions/loanPipelineActions";
import { useBorrowerSubmissionsHook } from "../../hooks/useBorrowerSubmissionsHook";
import { usePipelineHook } from "../../hooks/usePipelineHook";
import { useDispatch, useSelector } from "react-redux";

const typeEnums = {
  APPLICATION: "loanApps",
  CREDIT_AUTH: "creditAuths",
};
const ApplicationAssignmentModal = ({ application, type, onClearSelected }) => {
  const loanPipeline = useSelector((state) => state?.loanPipeline);
  const userEmailAddress = useSelector((state) => state.user?.emailAddress);
  const dispatch = useDispatch();

  const { getUserPipeline } = usePipelineHook();
  const modalTitle = useMemo(() => {
    if (type === typeEnums.APPLICATION) {
      return "Assign Loan Application";
    }
    if (type === typeEnums.CREDIT_AUTH) {
      return "Assign Credit Authorization";
    }
  }, [type]);
  const {
    loading,
    assignApplicationToDeal,
    assignApplicationToSalesperson,
    assignAuthToDeal,
    assignAuthToSalesperson,
  } = useBorrowerSubmissionsHook();

  const onClose = useCallback((props) => {
    onClearSelected();
  }, []);

  const loanNumberSelectOptions = useMemo(() => {
    if (!isArray(loanPipeline)) {
      getUserPipeline({
        onSuccessFn: (pipeline) => {
          dispatch(loanPipelineSet(pipeline));
          return pipeline;
        },
        onFailFn: () => {
          return [];
        },
      });
    }
    const options = loanPipeline?.map((l) => {
      return {
        label: `<${l?.loanNumber}> ${l?.loanName}`,
        optionLabel: `<${l?.loanNumber}> ${l?.loanName}`,
        value: l?._id,
      };
    });
    // console.log({ options });
    return options;
  }, [loanPipeline]);

  const initialValues = useMemo(() => {
    return {
      loanId: application?.dealId,
      salesperson: application?.salesperson
        ? application?.salesperson
        : userEmailAddress,
    };
  }, [userEmailAddress, application]);

  const onSubmit = (values) => {
    // console.log("onSubmit", { values, selected, loanNumberSelectOptions });

    if (isNil(type)) {
      return console.error("Type is required for assignment");
    }

    if (values?.loanId) {
      let payload = { ...application };
      if (values?.salesperson) {
        payload.salesperson = values?.salesperson;
      }

      const requestParams = {
        loanId: values?.loanId,
        appId: application?._id,
        data: payload,
        onSuccessFn: (d) => {
          dispatch(cachedDataItemSet(type, null));
          onClose();
        },
      };

      if (type === typeEnums.APPLICATION) {
        assignApplicationToDeal(requestParams);
      }
      if (type === typeEnums.CREDIT_AUTH) {
        assignAuthToDeal(requestParams);
      }
      return;
    }

    if (values?.salesperson) {
      const assignEmailParams = {
        appId: application?._id,
        emailAddress: values?.salesperson,
        onSuccessFn: (d) => {
          dispatch(cachedDataItemSet(type, null));
          onClose();
        },
      };

      if (type === typeEnums.APPLICATION) {
        assignApplicationToSalesperson(assignEmailParams);
      }
      if (type === typeEnums.CREDIT_AUTH) {
        assignAuthToSalesperson(assignEmailParams);
      }
    }
  };

  if (isNil(application)) {
    return;
  }

  return (
    <BasicModal
      show={!isNil(application)}
      title={modalTitle}
      onClose={onClose}
      maxWidth={"xs"}
    >
      <RffForm
        submitText="Save & Assign"
        loading={loading}
        initialValues={initialValues}
        onSubmit={onSubmit}
        // formSpy
      >
        <RffGroup>
          <RffSelectAutocompleteField
            label={"Assigned Loan:"}
            name="loanId"
            placeholder="Loan Number"
            options={loanNumberSelectOptions}
          />
          <RffSelectUserEmailField
            label={"Assigned Salesperson:"}
            name="salesperson"
            placeholder="Salesperson Email"
          />
        </RffGroup>
      </RffForm>
      {/* <JsonPreview values={selected} /> */}
    </BasicModal>
  );
};
export default ApplicationAssignmentModal;
