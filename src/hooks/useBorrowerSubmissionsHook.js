import axios from "axios";
import { isEmpty, isNil } from "lodash";
import { useAxiosHook } from "./useAxiosHook";

const ROUTE_PREFIX = "borrower_submissions";

export const useBorrowerSubmissionsHook = () => {
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
  //  GET /borrower_submissions/get_applications
  // -------------------------------------
  const getApplications = async ({ onSuccessFn, onCompleteFn, onFailFn }) => {
    const endpoint = `${ROUTE_PREFIX}/get_applications`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Get Applications",
      path: endpoint,
      cancelSource: source,
      onSuccessFn,
      onCompleteFn,
      onFailFn,
    };
    await axiosGetRequest(params);
  };

  // -------------------------------------
  //  GET /borrower_submissions/get_credit_authorizations
  // -------------------------------------
  const getCreditAuthorizations = async ({
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    const endpoint = `${ROUTE_PREFIX}/get_credit_authorizations`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Get Credit Authorizations",
      path: endpoint,
      cancelSource: source,
      onSuccessFn,
      onCompleteFn,
      onFailFn,
    };
    await axiosGetRequest(params);
  };

  // -------------------------------------
  //  GET /borrower_submissions/get_application/{app_id}
  // -------------------------------------
  const getApplicationById = async ({
    appId,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    if (isNil(appId) || isEmpty(appId)) {
      console.error("Application ID is missing", { appId });
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/get_application/${appId}`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Get Application By ID",
      path: endpoint,
      cancelSource: source,
      onSuccessFn,
      onCompleteFn,
      onFailFn,
    };
    await axiosGetRequest(params);
  };

  // -------------------------------------
  //  GET /borrower_submissions/get_credit_authorization/{app_id}
  // -------------------------------------
  const getCreditAuthorizationById = async ({
    appId,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    if (isNil(appId) || isEmpty(appId)) {
      console.error("Credit Authorization ID is missing", { appId });
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/get_credit_authorization/${appId}`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Get Credit Authorization By ID",
      path: endpoint,
      cancelSource: source,
      onSuccessFn,
      onCompleteFn,
      onFailFn,
    };
    await axiosGetRequest(params);
  };

  // -------------------------------------
  //  POST /borrower_submissions/new_application
  // -------------------------------------
  /**
   * Create a new loan application
   *
   * @example
   * // Example usage:
   * const applicationData = {
   *   firstName: "John",
   *   lastName: "Doe",
   *   emailAddress: "john.doe@example.com",
   *   phoneNumber: "555-123-4567",
   *   // Additional application fields
   * };
   *
   * const files = [file1, file2]; // Array of file objects from input
   *
   * createApplication({
   *   data: applicationData,
   *   files: files,
   *   onSuccessFn: (response) => console.log("Application created:", response),
   *   onFailFn: (error) => console.error("Error creating application:", error)
   * });
   */
  const createApplication = async ({
    // data,
    // files,
    payload,
    onSuccessFn,
  }) => {
    if (isNil(payload) || isEmpty(payload)) {
      console.error("Application data is missing", { payload });
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/new_application`;
    const source = axios.CancelToken.source();

    await axiosPostRequest({
      name: "Create Application",
      path: endpoint,
      cancelSource: source,
      payload,
      formData: true,
      includeQueryParams: true,
      onSuccessFn,
      // errorTesting,
    });
    // await axiosPostRequest({
    //   name: "Create Application",
    //   path: endpoint,
    //   payload: formData,
    //   formData: true,
    //   cancelSource: source,
    //   onSuccessFn,
    //   onSuccessMsg: "Application created successfully",
    //   onCompleteFn,
    //   onFailFn,
    // });
  };

  // -------------------------------------
  //  POST /borrower_submissions/new_credit_authorization
  // -------------------------------------
  /**
   * Create a new credit authorization
   *
   * @example
   * // Example usage:
   * const authData = {
   *   firstName: "John",
   *   lastName: "Doe",
   *   emailAddress: "john.doe@example.com",
   *   phoneNumber: "555-123-4567",
   *   ssn: "123-45-6789",
   *   // Additional credit auth fields
   * };
   *
   * const files = [file1, file2]; // Array of file objects from input
   *
   * createCreditAuthorization({
   *   data: authData,
   *   files: files,
   *   onSuccessFn: (response) => console.log("Credit auth created:", response),
   *   onFailFn: (error) => console.error("Error creating credit auth:", error)
   * });
   */
  const createCreditAuthorization = async ({
    payload,
    onCompleteFn,
    onSuccessFn,
  }) => {
    if (isNil(payload) || isEmpty(payload)) {
      console.error("Application data is missing", { payload });
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/new_credit_authorization`;
    const source = axios.CancelToken.source();

    await axiosPostRequest({
      name: "Create Credit Authorization",
      path: endpoint,
      cancelSource: source,
      payload,
      formData: true,
      includeQueryParams: true,
      onSuccessFn,
      hideFailMsg: true,
      onCompleteFn,
    });
  };

  // -------------------------------------
  //  POST /borrower_submissions/deal_generated_link/loan_application/{loanId}
  // -------------------------------------

  const generateDealApplicationLink = async ({
    loanId,
    borrowerData,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    if (isNil(loanId) || isEmpty(loanId) || isEmpty(borrowerData)) {
      console.error("Deal ID is missing", { loanId });
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/deal_generated_link/loan_application/${loanId}`;
    const source = axios.CancelToken.source();

    await axiosPostRequest({
      name: "Generate Deal Application Link",
      path: endpoint,
      payload: borrowerData,
      cancelSource: source,
      onSuccessFn,
      onSuccessMsg: "Application link generated successfully",
      onCompleteFn,
      onFailFn,
    });
  };

  const generateDealCreditAuthLink = async ({
    loanId,
    borrowerData,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    if (isNil(loanId) || isEmpty(loanId) || isEmpty(borrowerData)) {
      console.error("Deal ID is missing", { loanId });
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/deal_generated_link/credit_authorization/${loanId}`;
    const source = axios.CancelToken.source();

    await axiosPostRequest({
      name: "Generate Deal Credit Auth Link",
      path: endpoint,
      payload: borrowerData,
      cancelSource: source,
      onSuccessFn,
      onSuccessMsg: "Credit authorization link generated successfully",
      onCompleteFn,
      onFailFn,
    });
  };

  const generateLOApplicationLink = async ({
    salesperson,
    linkTag,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    const endpoint = `${ROUTE_PREFIX}/lo_generated_link/loan_application`;
    const source = axios.CancelToken.source();

    await axiosPostRequest({
      name: "Generate LO Application Link",
      path: endpoint,
      payload: { salesperson, linkTag },
      cancelSource: source,
      onSuccessFn,
      onCompleteFn,
      onFailFn,
    });
  };

  const generateLOCreditAuthLink = async ({
    linkTag,
    salesperson,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    const endpoint = `${ROUTE_PREFIX}/lo_generated_link/credit_authorization`;
    const source = axios.CancelToken.source();

    await axiosPostRequest({
      name: "Generate LO Credit Auth Link",
      path: endpoint,
      payload: { salesperson, linkTag },
      cancelSource: source,
      onSuccessFn,
      // onSuccessMsg: "Credit authorization link generated successfully",
      onCompleteFn,
      onFailFn,
    });
  };

  const generateBorrowerApplicationLink = async ({
    data,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    if (isNil(data) || isEmpty(data)) {
      console.error("Borrower data is missing", { data });
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/borrower_generated_link/loan_application`;
    const source = axios.CancelToken.source();

    await axiosPostRequest({
      name: "Generate Borrower Application Link",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessFn,
      onSuccessMsg: "Borrower application link generated successfully",
      onCompleteFn,
      onFailFn,
    });
  };

  // -------------------------------------
  //  POST /borrower_submissions/borrower_generated_link/credit_authorization
  // -------------------------------------
  /**
   * Generate a credit authorization link for borrower website
   *
   * @example
   * // Example usage:
   * const borrowerInfo = {
   *   borrower: {
   *     emailAddress: "john.doe@example.com",
   *     firstName: "John",
   *     lastName: "Doe",
   *     phoneNumber: "555-123-4567"
   *   }
   * };
   *
   * generateBorrowerCreditAuthLink({
   *   data: borrowerInfo,
   *   onSuccessFn: (response) => console.log("Link generated:", response),
   *   onFailFn: (error) => console.error("Error generating link:", error)
   * });
   */
  const generateBorrowerCreditAuthLink = async ({
    data,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    if (isNil(data) || isEmpty(data)) {
      console.error("Borrower data is missing", { data });
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/borrower_generated_link/credit_authorization`;
    const source = axios.CancelToken.source();

    await axiosPostRequest({
      name: "Generate Borrower Credit Auth Link",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessFn,
      onSuccessMsg: "Borrower credit auth link generated successfully",
      onCompleteFn,
      onFailFn,
    });
  };

  // -------------------------------------
  //  POST /borrower_submissions/assign_app_to_deal/{app_id}/{deal_id}
  // -------------------------------------
  /**
   * Assign an application to a deal
   *
   * @example
   * // Example usage:
   * const assignData = {
   *   salesperson: "sales@example.com" // Optional
   * };
   *
   * assignApplicationToDeal({
   *   appId: "60a12345b789c0d123e45f67",
   *   loanId: "60b67890c1d2e3f456g78h90",
   *   data: assignData,
   *   onSuccessFn: (response) => console.log("Application assigned:", response)
   * });
   */
  const assignApplicationToDeal = async ({
    appId,
    loanId,
    data,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    if (isNil(appId) || isEmpty(appId)) {
      console.error("Application ID is missing", { appId });
      return;
    }
    if (isNil(loanId) || isEmpty(loanId)) {
      console.error("Deal ID is missing", { loanId });
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/assign_app_to_deal/${appId}/${loanId}`;
    const source = axios.CancelToken.source();

    await axiosPostRequest({
      name: "Assign Application to Deal",
      path: endpoint,
      payload: data || {},
      cancelSource: source,
      onSuccessFn,
      // errorTesting: true,
      onSuccessMsg: "Application assigned to deal successfully",
      onCompleteFn,
      onFailFn,
    });
  };

  const assignAuthToDeal = async ({
    appId,
    loanId,
    data,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    if (isNil(appId) || isEmpty(appId)) {
      console.error("Credit Authorization ID is missing", { appId });
      return;
    }
    if (isNil(loanId) || isEmpty(loanId)) {
      console.error("Deal ID is missing", { loanId });
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/assign_auth_to_deal/${appId}/${loanId}`;
    const source = axios.CancelToken.source();

    await axiosPostRequest({
      name: "Assign Credit Auth to Deal",
      path: endpoint,
      payload: data || {},
      cancelSource: source,
      onSuccessFn,
      onSuccessMsg: "Credit authorization assigned to deal successfully",
      onCompleteFn,
      onFailFn,
    });
  };

  // -------------------------------------
  //  POST /borrower_submissions/assign_app_to_salesperson/{app_id}
  // -------------------------------------
  /**
   * Assign an application to a salesperson
   *
   * @example
   * // Example usage:
   * const salespersonData = {
   *   salesperson: "sales@example.com"
   * };
   *
   * assignApplicationToSalesperson({
   *   appId: "60a12345b789c0d123e45f67",
   *   data: salespersonData,
   *   onSuccessFn: (response) => console.log("Application assigned:", response)
   * });
   */
  const assignApplicationToSalesperson = async ({
    appId,
    emailAddress,

    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    if (isNil(appId) || isEmpty(appId)) {
      console.error("Application ID is missing", { appId });
      return;
    }
    if (isNil(emailAddress)) {
      console.error("Salesperson email is missing", emailAddress);
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/assign_app_to_salesperson/${appId}`;
    const source = axios.CancelToken.source();

    await axiosPostRequest({
      name: "Assign Application to Salesperson",
      path: endpoint,
      payload: { salesperson: emailAddress },
      cancelSource: source,
      onSuccessFn,
      // errorTesting: true,
      onSuccessMsg: "Application assigned to salesperson successfully",
      onCompleteFn,
      onFailFn,
    });
  };

  // -------------------------------------
  //  POST /borrower_submissions/assign_auth_to_salesperson/{app_id}
  // -------------------------------------
  /**
   * Assign a credit authorization to a salesperson
   *
   * @example
   * // Example usage:
   * const salespersonData = {
   *   salesperson: "sales@example.com"
   * };
   *
   * assignAuthToSalesperson({
   *   appId: "60a12345b789c0d123e45f67",
   *   data: salespersonData,
   *   onSuccessFn: (response) => console.log("Credit auth assigned:", response)
   * });
   */
  const assignAuthToSalesperson = async ({
    appId,
    emailAddress,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    if (isNil(appId) || isEmpty(appId)) {
      console.error("Application ID is missing", { appId });
      return;
    }
    if (isNil(emailAddress)) {
      console.error("Salesperson email is missing", emailAddress);
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/assign_auth_to_salesperson/${appId}`;
    const source = axios.CancelToken.source();

    await axiosPostRequest({
      name: "Assign Credit Auth to Salesperson",
      path: endpoint,
      payload: { salesperson: emailAddress },
      cancelSource: source,
      onSuccessFn,
      onSuccessMsg: "Credit authorization assigned to salesperson successfully",
      onCompleteFn,
      onFailFn,
    });
  };

  return {
    loading,
    error,
    getApplications,
    getCreditAuthorizations,
    getApplicationById,
    getCreditAuthorizationById,
    createApplication,
    createCreditAuthorization,
    generateDealApplicationLink,
    generateDealCreditAuthLink,
    generateLOApplicationLink,
    generateLOCreditAuthLink,
    generateBorrowerApplicationLink,
    generateBorrowerCreditAuthLink,
    assignApplicationToDeal,
    assignAuthToDeal,
    assignApplicationToSalesperson,
    assignAuthToSalesperson,
  };
};
