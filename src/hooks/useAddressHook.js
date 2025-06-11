import axios from "axios";
import { useAxiosHook } from "./useAxiosHook";
import { isEmpty, isNil } from "lodash";

const ROUTE_PREFIX = "property_address";

export const useAddressHook = () => {
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

  const createSubjectPropertyFromObject = async ({
    dealId,
    subjectPropertyId,
    addressObject,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    const endpoint = `${ROUTE_PREFIX}/subjectProperty/create_from_object/${dealId}/${subjectPropertyId}`;
    const source = axios.CancelToken.source();

    if (isNil(dealId) || isNil(subjectPropertyId) || isNil(addressObject)) {
      console.error(
        "Deal ID, Subject Property ID, or address object is missing",
        {
          dealId,
          subjectPropertyId,
          addressObject,
        }
      );
      return;
    }

    await axiosPostRequest({
      name: "Create Subject Property Address from Object",
      path: endpoint,
      payload: { address_object: addressObject },
      cancelSource: source,
      onSuccessMsg: "Subject property address created successfully",
      onSuccessFn,
      onCompleteFn,
      onFailFn,
    });
  };

  const createSubjectPropertyFromString = async ({
    dealId,
    subjectPropertyId,
    addressString,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    const endpoint = `${ROUTE_PREFIX}/subjectProperty/create_from_string/${dealId}/${subjectPropertyId}`;
    const source = axios.CancelToken.source();

    if (isNil(dealId) || isNil(subjectPropertyId) || isNil(addressString)) {
      console.error(
        "Deal ID, Subject Property ID, or address string is missing",
        {
          dealId,
          subjectPropertyId,
          addressString,
        }
      );
      return;
    }

    await axiosPostRequest({
      name: "Create Subject Property Address from String",
      path: endpoint,
      payload: { address_string: addressString },
      cancelSource: source,
      onSuccessMsg: "Subject property address created successfully",
      onSuccessFn,
      onCompleteFn,
      onFailFn,
    });
  };

  const updateSubjectPropertyAddress = async ({
    dealId,
    subjectPropertyId,
    addressObject,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    const endpoint = `${ROUTE_PREFIX}/subjectProperty/update/${dealId}/${subjectPropertyId}`;
    const source = axios.CancelToken.source();

    if (isNil(dealId) || isNil(subjectPropertyId) || isNil(addressObject)) {
      console.error(
        "Deal ID, Subject Property ID, or address object is missing",
        {
          dealId,
          subjectPropertyId,
          addressObject,
        }
      );
      return;
    }

    await axiosPostRequest({
      name: "Update Subject Property Address",
      path: endpoint,
      payload: { address_object: addressObject },
      cancelSource: source,
      onSuccessMsg: "Subject property address updated successfully",
      onSuccessFn,
      onCompleteFn,
      onFailFn,
      // errorTesting: true,
    });
  };

  // Borrower Address Methods
  const createBorrowerAddressFromObject = async ({
    dealId,
    borrowerId,
    addressObject,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    const endpoint = `${ROUTE_PREFIX}/borrower/create_from_object/${dealId}/${borrowerId}`;
    const source = axios.CancelToken.source();

    if (isNil(dealId) || isNil(borrowerId) || isNil(addressObject)) {
      console.error("Deal ID, Borrower ID, or address object is missing", {
        dealId,
        borrowerId,
        addressObject,
      });
      return;
    }

    await axiosPostRequest({
      name: "Create Borrower Address from Object",
      path: endpoint,
      payload: { address_object: addressObject },
      cancelSource: source,
      onSuccessMsg: "Borrower address created successfully",
      onSuccessFn,
      onCompleteFn,
      onFailFn,
    });
  };

  const createBorrowerAddressFromString = async ({
    dealId,
    borrowerId,
    addressString,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    const endpoint = `${ROUTE_PREFIX}/borrower/create_from_string/${dealId}/${borrowerId}`;
    const source = axios.CancelToken.source();

    if (isNil(dealId) || isNil(borrowerId) || isNil(addressString)) {
      console.error("Deal ID, Borrower ID, or address string is missing", {
        dealId,
        borrowerId,
        addressString,
      });
      return;
    }

    await axiosPostRequest({
      name: "Create Borrower Address from String",
      path: endpoint,
      payload: { address_string: addressString },
      cancelSource: source,
      onSuccessMsg: "Borrower address created successfully",
      onSuccessFn,
      onCompleteFn,
      onFailFn,
    });
  };

  const updateBorrowerAddress = async ({
    dealId,
    borrowerId,
    addressObject,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    const endpoint = `${ROUTE_PREFIX}/borrower/update/${dealId}/${borrowerId}`;
    const source = axios.CancelToken.source();

    if (isNil(dealId) || isNil(borrowerId) || isNil(addressObject)) {
      console.error("Deal ID, Borrower ID, or address object is missing", {
        dealId,
        borrowerId,
        addressObject,
      });
      return;
    }

    await axiosPostRequest({
      name: "Update Borrower Address",
      path: endpoint,
      payload: { address_object: addressObject },
      cancelSource: source,
      onSuccessMsg: "Borrower address updated successfully",
      onSuccessFn,
      onCompleteFn,
      onFailFn,
    });
  };

  return {
    error,
    loading,
    // Subject Property methods
    createSubjectPropertyFromObject,
    createSubjectPropertyFromString,
    updateSubjectPropertyAddress,
    // Borrower methods
    createBorrowerAddressFromObject,
    createBorrowerAddressFromString,
    updateBorrowerAddress,
  };
};
