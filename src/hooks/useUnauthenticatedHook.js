import { useDispatch } from "react-redux";

import axios from "axios";
import { useAxiosHook } from "./useAxiosHook";
const ROUTE_PREFIX = "borrower_submissions";
export const useUnauthenticatedHook = () => {
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
  /**
   * Loan Applications
   */
  const testLogin = async ({ emailAddress, errorTesting, onSuccessFn }) => {
    const endpoint = `users/user_login/${emailAddress}`;
    // const endpoint = `${ROUTE_PREFIX}/applications`;
    const source = axios.CancelToken.source();

    const params = {
      name: "Create Loan Application",
      path: endpoint,
      cancelSource: source,

      errorTesting,
      onSuccessFn,
    };

    await axiosGetRequest(params);
  };
  const createLoanApplication = async ({
    payload,
    errorTesting,
    onSuccessFn,
  }) => {
    const endpoint = `${ROUTE_PREFIX}/new_application`;
    // const endpoint = `${ROUTE_PREFIX}/applications`;
    const source = axios.CancelToken.source();

    const params = {
      name: "Create Loan Application",
      path: endpoint,
      cancelSource: source,
      payload,
      formData: true,
      includeQueryParams: true,
      errorTesting,
      onSuccessFn,
    };

    await axiosPostRequest(params);
  };

  const getLoanApplications = async ({ id, errorTesting, onSuccessFn }) => {
    const endpoint = `${ROUTE_PREFIX}/get_applications`;
    const source = axios.CancelToken.source();

    const params = {
      name: "Get Loan Applications",
      path: endpoint,

      cancelSource: source,

      errorTesting,
      onSuccessFn,
    };

    await axiosGetRequest(params);
  };

  const getLoanApplicationById = async ({ id, errorTesting, onSuccessFn }) => {
    const endpoint = `${ROUTE_PREFIX}/applications/${id}`;
    const source = axios.CancelToken.source();

    const params = {
      name: "Get Loan Application By ID",
      path: endpoint,

      cancelSource: source,
      formData: true,
      includeQueryParams: true,
      errorTesting,
      onSuccessFn,
    };

    await axiosGetRequest(params);
  };

  /**
   * Credit Authorizations
   */
  const createCreditAuth = async ({ payload, onSuccessFn }) => {
    const endpoint = `${ROUTE_PREFIX}/new_credit_authorization`;
    // const endpoint = `${ROUTE_PREFIX}/credit_authorizations`;
    const source = axios.CancelToken.source();

    const params = {
      name: "Create Credit Auth",
      path: endpoint,
      payload,
      cancelSource: source,
      formData: true,
      includeQueryParams: true,

      onSuccessFn,
    };

    await axiosPostRequest(params);
  };

  const getCreditAuthorizations = async ({ id, errorTesting, onSuccessFn }) => {
    const endpoint = `${ROUTE_PREFIX}/credit_authorizations`;
    const source = axios.CancelToken.source();

    const params = {
      name: "Get Credit Authorizations",
      path: endpoint,
      cancelSource: source,
      errorTesting,
      onSuccessFn,
    };

    await axiosGetRequest(params);
  };

  const getCreditAuthorizationById = async ({
    id,
    errorTesting,
    onSuccessFn,
  }) => {
    const endpoint = `${ROUTE_PREFIX}/credit_authorizations/${id}`;
    const source = axios.CancelToken.source();

    const params = {
      name: "Get Credit Authorization By ID",
      path: endpoint,
      cancelSource: source,
      errorTesting,
      onSuccessFn,
    };

    await axiosGetRequest(params);
  };

  return {
    error,
    loading,
    testLogin,
    // Loan application–related
    createLoanApplication,
    getLoanApplications,
    getLoanApplicationById,

    // Credit authorization–related
    createCreditAuth,
    getCreditAuthorizations,
    getCreditAuthorizationById,
  };
};
