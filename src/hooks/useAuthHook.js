import axios from "axios";
import { useAxiosHook } from "./useAxiosHook";

const ENCOMPASS_ROUTE_PREFIX = "encompass_data";
const DASHBOARD_ROUTE_PREFIX = "dashboard";

export const useAuthHook = () => {
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
   *
   * GET REQUESTS
   *
   */
  const sendEmailToken = async ({ onSuccessFn, onFailFn }) => {
    const endpoint = `${ENCOMPASS_ROUTE_PREFIX}/loan_pipeline_query`;
    const source = axios.CancelToken.source();

    const payload = {
      folderName: "1098 Forms Due",
      folderType: "Regular",
      actionsAllowed: ["DuplicateFrom", "DuplicateInto", "Import", "Originate"],
      isArchiveFolder: false,
      includeDuplicateLoanCheck: true,
      updateDateTime: "2024-10-14T19:48:57.385284",
    };
    // await axiosPostRequest({
    //   name: "Get Encompass Pipeline",
    //   path: endpoint,
    //   cancelSource: source,
    //   payload,
    //   onSuccessFn,
    //   onFailFn,
    // });
  };

  const loginUser = async ({ onSuccessFn, onFailFn }) => {
    const endpoint = `${ENCOMPASS_ROUTE_PREFIX}/loan_pipeline_query`;
    const source = axios.CancelToken.source();

    const payload = {
      folderName: "1098 Forms Due",
      folderType: "Regular",
      actionsAllowed: ["DuplicateFrom", "DuplicateInto", "Import", "Originate"],
      isArchiveFolder: false,
      includeDuplicateLoanCheck: true,
      updateDateTime: "2024-10-14T19:48:57.385284",
    };
    // await axiosPostRequest({
    //   name: "Get Encompass Pipeline",
    //   path: endpoint,
    //   cancelSource: source,
    //   payload,
    //   onSuccessFn,
    //   onFailFn,
    // });
  };

  return {
    error,
    loading,
    sendEmailToken,
    loginUser,
  };
};
