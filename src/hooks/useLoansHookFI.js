import { useDispatch } from "react-redux";

import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useCallback } from "react";
import { useAxiosHook } from "./useAxiosHook";

// **prefix UW loans with /underwriting/...  **

export const useLoansHookFI = () => {
  // const { error, isLoading, uploadFile } = useIronlincFilesHook();
  const {
    axiosPostIsLoading,
    isLoading,
    axiosGetIsLoading,
    axiosError,
    axiosGetRequest,
    axiosPostRequest,
  } = useAxiosHook();
  const loading = isLoading || axiosGetIsLoading || axiosPostIsLoading;
  // Hooks
  const dispatch = useDispatch();
  const error = axiosError;

  // ----------------- New Stuff ----------------- //
  /**  FETCHING DATA    */
  const getAllLoans = async ({ _id, ironId, cancelSource, onSuccessFn }) => {
    // const endpoint = `get_deal?dealId=${dealId}`;
    const endpoint = `underwriting/pipeline`; // causes CORS when ironID is incliuded
    const source = axios.CancelToken.source();

    const onRequestSuccess = (data) => {
      if (onSuccessFn) {
        onSuccessFn(data);
      }
    };

    const params = {
      name: "Get deal data",
      path: endpoint,
      cancelSource: source,
      type: "accounting",
      // cancelSource: cancelSource,
      onSuccessFn: onRequestSuccess,
    };

    await axiosGetRequest(params);
  };

  const getLoanById = async ({ _id, ironId, dealId, onSuccessFn }) => {
    // const endpoint = `get_deal?dealId=${dealId}`;
    const endpoint = `underwriting/deal/${dealId}`; // causes CORS when ironID is incliuded
    const source = axios.CancelToken.source();

    const onRequestSuccess = (data) => {
      if (onSuccessFn) {
        onSuccessFn(data);
      }
    };

    const params = {
      name: "Get underwriting deal",
      path: endpoint,
      cancelSource: source,
      // cancelSource: cancelSource,
      onSuccessFn: onRequestSuccess,
    };

    await axiosGetRequest(params);
  };

  /**  CREATING/INITIATING -- doesnt require previous data    */
  const createUnderwritingLoan = ({
    payload, //required
    onSuccessFn,
  }) => {
    // function onSuccess() {
    //   dispatch(updateDealDrilldown({ key: name, value: value }));
    //   enqueueSnackbar("Update saved", {
    //     variant: "success",
    //   });

    //   if (onSuccessFn) {
    //     onSuccessFn();
    //   }
    // }

    const endpoint = `underwriting/createloan`;
    const params = {
      name: "Create underwrtiting loan",
      path: endpoint,
      payload: payload,
      type: "accounting",

      // onSuccessFn: onSuccess,
    };

    console.log("params", params);
    // onSuccess();
    axiosPostRequest(params);
  };

  const uploadDealFiles = useCallback(
    async ({ dealId, files, onSuccessFn }) => {
      // const path = `underwriting/uploadFiles/${dealId}`;
      const path = `underwriting/uploadLoanDocs/${dealId}`;

      // "files" at this point is still the unmoified file list with all the data  including types
      const params = {
        name: "Upload deal files",
        path: path,
        // payload: createFileUploadPayload(files),
        type: "accounting",
        onSuccessFn: onSuccessFn,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      await axiosPostRequest(params);
    },
    []
  );

  //
  /** UPDATING - Deals with  previously existing data    */
  const updateSingleDealValue = ({
    dealId, //required
    name, //required
    value, //required
    onSuccessFn,
  }) => {
    function onSuccess() {
      // dispatch(updateDealDrilldown({ key: name, value: value }));
      enqueueSnackbar("Update saved", {
        variant: "success",
      });

      if (onSuccessFn) {
        onSuccessFn();
      }
    }

    let payload = {};
    payload[name] = value;

    const path = `underwriting/dealUpdate/${dealId}`;
    const params = {
      name: "Update Single Value on Deal Root",
      path: path,
      payload: payload,
      onSuccessFn: onSuccess,
    };

    console.log("updateSingleDealValue", params);
    // onSuccess();
    // await axiosPostRequest(params);
  };

  const updateFullDealObjectValue = ({
    dealId, //required
    objectName,
    objectValue, //required
    onSuccessFn,
  }) => {
    // let payload = {};
    // payload[objectName] = objectValue;
    // let objectValue = {};
    // objectValue[name] = value;
    /**
      const options = {
        titleReport: Title,
        underwritingCheckList: UnderwritingChecklist,
        underwritingNotes: UnderwritingNotes,
        loanLock: LoanLock,
        borrowerEntity: BorrowingEntity,
        sizer: LoanSizer,
        moneyIn: MoneyIn,
        netFunding: NetFunding,
      };
     */

    // function onSuccess() {
    //   // let updatedObjectValue = {};
    //   dispatch(updateDealDrilldownObject({ objectName, key: name, value: value }));
    //   enqueueSnackbar("Update saved", {
    //     variant: "success",
    //   });

    //   if (onSuccessFn) {
    //     onSuccessFn();
    //   }
    // }

    const path = `/dealObjectUpdate/${objectName}/${dealId}`;
    const params = {
      name: "Update Full Deal Object Value",
      path: path,
      payload: objectValue,
      // onSuccessFn: onSuccess,
    };

    console.log("updateFullDealObjectValue params", params);
    // onSuccess();
    // await axiosPostRequest(params);
  };

  const updateSingleDealObjectValue = ({
    _id, //required
    objectData,
    objectName,
    name, //required
    value, //required
    onSuccessFn,
  }) => {
    let payload = {};
    let objectValue = {};
    objectValue[name] = value;
    payload[objectName] = objectValue;

    const path = `updateDeal?dealId=${_id}`;
    const params = {
      name: "Update Single Deal Object Value",
      path: path,
      payload: payload,
      // onSuccessFn: onSuccess,
    };

    console.log("params", params);
    // onSuccess();
    // await axiosPostRequest(params);
  };

  // !!----------------- Old Stuff -----------------!! //

  const getDealData = async ({ _id, ironId, onSuccessFn }) => {
    // const endpoint = `get_deal?dealId=${dealId}`;
    const endpoint = `get_deal?dealId=${_id}&ironId=${ironId}`; // causes CORS when ironID is incliuded
    const source = axios.CancelToken.source();

    const onRequestSuccess = (data) => {
      if (onSuccessFn) {
        onSuccessFn(data);
      }
    };

    const params = {
      name: "Get deal data",
      path: endpoint,
      cancelSource: source,
      // cancelSource: cancelSource,
      onSuccessFn: onRequestSuccess,
    };

    await axiosGetRequest(params);
  };

  const getAllDeals = async ({ onSuccessFn }) => {
    const endpoint = `getDealHeaders?userEmail=*`;

    const onRequestSuccess = (passedData) => {
      const resData = passedData?.items;

      if (onSuccessFn) {
        onSuccessFn(resData);
      }
    };

    const params = {
      name: "Get All Deals",
      path: endpoint,
      onSuccessFn: onRequestSuccess,
    };

    await axiosGetRequest(params);
  };

  const updateDealData = async ({
    _id, //required
    ironId, //required
    payload, //required
    onSuccessFn,
  }) => {
    const endpoint = `updateDeal?dealId=${_id}&ironId=${ironId}`;

    const onRequestSuccess = (passedData) => {
      if (onSuccessFn) {
        onSuccessFn(passedData);
      }
    };

    const params = {
      name: "Update Loan Data",
      path: endpoint,
      payload,
      onSuccessFn: onRequestSuccess,
    };

    // console.log("params", params);
    await axiosPostRequest(params);
  };

  // const getAndSetDealPipeline = async () => {
  //   getAllDeals({
  //     onSuccessFn: (deals) => {
  //       dispatch(setDealPipeline(deals));
  //     },
  //   });
  // };

  return {
    error,
    loading,
    getAllLoans,
    getLoanById,

    // getUnderwritingDeal,
    // uploadDealFiles,
    // updateSingleDealValue,
    // updateSingleDealObjectValue,
    // updateFullDealObjectValue,
    // createUnderwritingLoan,
    // getFullUnderwritingPipeline,
    // // LEGACY
    // getDealData,
    // getAllDeals,
    // updateDealData,
    // getAndSetDealPipeline,
  };
};
