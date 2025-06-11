import axios from "axios";
import { useAxiosHook } from "./useAxiosHook";

const ROUTE_PREFIX = "users";

export const useUsersHook = () => {
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

  // -----------------------------
  //  GET /users/logged_in_user
  // -----------------------------
  const getLoggedInUser = async ({ onSuccessFn, onErrorFn }) => {
    const endpoint = `${ROUTE_PREFIX}/logged_in_user`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Get Logged In User",
      path: endpoint,
      cancelSource: source,
      onSuccessFn,
      onErrorFn,
    };

    await axiosGetRequest(params);
  };

  // -----------------------------
  //  GET /users/user/:user_id
  // -----------------------------
  const getUserById = async ({ userId, onSuccessFn, onErrorFn }) => {
    const endpoint = `${ROUTE_PREFIX}/user/${userId}`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Get User By Id",
      path: endpoint,
      cancelSource: source,
      onSuccessFn,
      onErrorFn,
    };

    await axiosGetRequest(params);
  };

  // -----------------------------
  //  GET /users/all_stytch_users
  // -----------------------------
  const getAllStytchUsers = async ({ onSuccessFn, onErrorFn }) => {
    const endpoint = `${ROUTE_PREFIX}/all_stytch_users`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Get All Stytch Users",
      path: endpoint,
      cancelSource: source,
      onSuccessFn,
      onErrorFn,
    };

    await axiosGetRequest(params);
  };

  // -----------------------------
  //  GET /users/all_users
  // -----------------------------
  const getAllUsers = async ({ onSuccessFn, onErrorFn }) => {
    const endpoint = `${ROUTE_PREFIX}/all_users`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Get All Users",
      path: endpoint,
      cancelSource: source,
      onSuccessFn,
      onErrorFn,
    };

    await axiosGetRequest(params);
  };

  // -----------------------------
  //  POST /users/create_user
  // -----------------------------
  const createUser = async ({ data, onSuccessFn, onErrorFn }) => {
    /**
    {
    "firstName": "Francisco",
    "lastName": "Lindor",
    "emailAddress": "fl@mets.com",
    "phone_number": "5555555555",
    "role": "Admin",
    "query_params": {}
    }
     */
    const endpoint = `${ROUTE_PREFIX}/create_user`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Create User",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessFn,
      onErrorFn,
    };

    await axiosPostRequest(params);
  };

  return {
    error,
    loading,
    getLoggedInUser,
    getUserById,
    getAllStytchUsers,
    getAllUsers,
    createUser,
  };
};
