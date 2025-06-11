import axios from "axios";
import { useAxiosHook } from "./useAxiosHook";

const ROUTE_PREFIX = "loportal";

export const usePipelineHook = () => {
  const {
    axiosPostIsLoading,
    isLoading,
    axiosGetIsLoading,
    axiosError,
    axiosGetRequest,
    axiosPostRequest,
  } = useAxiosHook();

  const loading = isLoading || axiosGetIsLoading || axiosPostIsLoading;
  const error = axiosError;

  // -------------------------------------
  //  POST /loportal/new_scenario_by_email
  // -------------------------------------
  const newScenarioByEmail = async ({ data, onSuccessFn, onFailFn }) => {
    const endpoint = `${ROUTE_PREFIX}/new_scenario_by_email`;
    const source = axios.CancelToken.source();
    const params = {
      name: "New Scenario By Email",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessFn,
      onFailFn,
    };
    await axiosPostRequest(params);
  };

  // -------------------------------------
  //  POST /loportal/send_deal_application_link/{dealId}
  // -------------------------------------
  const sendDealApplicationLink = async ({
    dealId,
    data,
    onSuccessFn,
    onFailFn,
  }) => {
    const endpoint = `${ROUTE_PREFIX}/send_deal_application_link/${dealId}`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Send Deal Application Link",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessFn,
      onFailFn,
    };
    await axiosPostRequest(params);
  };

  // -------------------------------------
  //  POST /loportal/send_lo_application_link/{loanOfficerId}
  // -------------------------------------
  const sendLoApplicationLink = async ({
    loanOfficerId,
    data,
    onSuccessFn,
    onFailFn,
  }) => {
    const endpoint = `${ROUTE_PREFIX}/send_lo_application_link/${loanOfficerId}`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Send LO Application Link",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessFn,
      onFailFn,
    };
    await axiosPostRequest(params);
  };

  // -------------------------------------
  //  POST /loportal/import_from_excel/create_prospect
  // -------------------------------------
  const newProspectFromExcel = async ({ data, onSuccessFn, onFailFn }) => {
    // `data` should include the form-data with the file
    const endpoint = `${ROUTE_PREFIX}/import_from_excel/create_prospect`;
    const source = axios.CancelToken.source();
    const params = {
      name: "New Prospect From Excel",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessFn,
      onFailFn,
      // Make sure your useAxiosHook sets appropriate headers for file upload
    };
    await axiosPostRequest(params);
  };

  // -------------------------------------
  //  POST /loportal/import_from_excel/populate_prospect_form
  // -------------------------------------
  const populateProspectFromExcel = async ({ data, onSuccessFn, onFailFn }) => {
    const endpoint = `${ROUTE_PREFIX}/import_from_excel/populate_prospect_form`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Populate Prospect Form From Excel",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessFn,
      onFailFn,
    };
    await axiosPostRequest(params);
  };

  // -------------------------------------
  //  POST /loportal/create_prospect
  // -------------------------------------
  const createProspect = async ({ data, onSuccessFn, onFailFn }) => {
    const endpoint = `${ROUTE_PREFIX}/create_prospect`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Create Prospect",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessFn,
      onFailFn,
    };
    await axiosPostRequest(params);
  };

  // -------------------------------------
  //  GET /loportal/loan/{loanId}
  // -------------------------------------
  const getLoanById = async ({ loanId, onSuccessFn, onFailFn }) => {
    const endpoint = `${ROUTE_PREFIX}/loan/${loanId}`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Get Loan By Id",
      path: endpoint,
      cancelSource: source,
      onSuccessFn,
      onFailFn,
    };
    await axiosGetRequest(params);
  };

  // -------------------------------------
  //  POST /loportal/update_loan/subjectProperties/{loanId}
  // -------------------------------------
  const updateLoanSubjectProperties = async ({
    loanId,
    data,
    onSuccessFn,
    onFailFn,
  }) => {
    const endpoint = `${ROUTE_PREFIX}/update_loan/subjectProperties/${loanId}`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Update Loan Subject Properties",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessFn,
      onFailFn,
    };
    await axiosPostRequest(params);
  };

  // -------------------------------------
  //  GET /loportal/user_pipeline
  // -------------------------------------
  const getUserPipeline = async ({ onSuccessFn, onFailFn }) => {
    const endpoint = `${ROUTE_PREFIX}/user_pipeline`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Get User Pipeline",
      path: endpoint,
      cancelSource: source,
      onSuccessFn,
      onFailFn,
    };
    await axiosGetRequest(params);
  };

  // -------------------------------------
  //  POST /loportal/update_milestone/{dealId}
  // -------------------------------------
  const updateMilestoneStatus = async ({
    dealId,
    data,
    onSuccessFn,
    onFailFn,
  }) => {
    const endpoint = `${ROUTE_PREFIX}/update_milestone/${dealId}`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Update Milestone Status",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessFn,
      onFailFn,
    };
    await axiosPostRequest(params);
  };

  // -------------------------------------
  //  POST /loportal/add_subscribed_user/{dealId}
  // -------------------------------------
  const addSubscribedUser = async ({ dealId, data, onSuccessFn, onFailFn }) => {
    const endpoint = `${ROUTE_PREFIX}/add_subscribed_user/${dealId}`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Add Subscribed User",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessFn,
      onFailFn,
    };
    await axiosPostRequest(params);
  };

  // -------------------------------------
  //  POST /loportal/remove_subscribed_user/{dealId}
  // -------------------------------------
  const removeSubscribedUser = async ({
    dealId,
    data,
    onSuccessFn,
    onFailFn,
  }) => {
    const endpoint = `${ROUTE_PREFIX}/remove_subscribed_user/${dealId}`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Remove Subscribed User",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessFn,
      onFailFn,
    };
    await axiosPostRequest(params);
  };

  // -------------------------------------
  //  POST /loportal/add_loan_tag/{dealId}
  // -------------------------------------
  const addLoanTag = async ({ dealId, data, onSuccessFn, onFailFn }) => {
    const endpoint = `${ROUTE_PREFIX}/add_loan_tag/${dealId}`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Add Loan Tag",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessFn,
      onFailFn,
    };
    await axiosPostRequest(params);
  };

  // -------------------------------------
  //  POST /loportal/remove_loan_tag/{dealId}
  // -------------------------------------
  const removeLoanTag = async ({ dealId, data, onSuccessFn, onFailFn }) => {
    const endpoint = `${ROUTE_PREFIX}/remove_loan_tag/${dealId}`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Remove Loan Tag",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessFn,
      onFailFn,
    };
    await axiosPostRequest(params);
  };

  // -------------------------------------
  //  POST /loportal/create_comment/{dealId}
  // -------------------------------------
  const createDealComment = async ({ dealId, data, onSuccessFn, onFailFn }) => {
    const endpoint = `${ROUTE_PREFIX}/create_comment/${dealId}`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Create Deal Comment",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessFn,
      onFailFn,
    };
    await axiosPostRequest(params);
  };

  return {
    error,
    loading,

    // GET
    getUserPipeline,
    getLoanById,

    // POST
    newScenarioByEmail,
    sendDealApplicationLink,
    sendLoApplicationLink,
    newProspectFromExcel,
    populateProspectFromExcel,
    createProspect,
    updateLoanSubjectProperties,
    updateMilestoneStatus,
    addSubscribedUser,
    removeSubscribedUser,
    addLoanTag,
    removeLoanTag,
    createDealComment,
  };
};
