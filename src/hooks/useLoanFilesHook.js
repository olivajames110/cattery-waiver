import axios from "axios";
import { useAxiosHook } from "./useAxiosHook";
import { useCallback } from "react";
import { format } from "date-fns";
import { isNil, size } from "lodash";

const ROUTE_PREFIX = "files";

// TO DO
// make general file upload endpoints
// -- uploadSingleFile({file, onSuccessFn, onFailFn})
// -- uploadMultipleFiles({files, onSuccessFn, onFailFn})
// -- uploadFilesWithFormData({formData, onSuccessFn, onFailFn})

export const useLoanFilesHook = () => {
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
  //  POST /files/upload_pipeline_files/{container_name}
  // -------------------------------------
  const uploadPipelineFiles = async ({
    containerName,
    data,
    onSuccessFn,
    onFailFn,
  }) => {
    const endpoint = `${ROUTE_PREFIX}/upload_pipeline_files/${containerName}`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Upload Pipeline Files",
      path: endpoint,
      payload: data, // data is your FormData with submission + files
      cancelSource: source,
      onSuccessFn,
      onFailFn,
      // Ensure your useAxiosHook sets up correct headers for multipart/form-data
    };
    await axiosPostRequest(params);
  };

  // -------------------------------------
  //  POST /files/upload_loan_docs/{loanId}
  // -------------------------------------
  const uploadLoanDocs = async ({
    loanId,
    files,
    onSuccessFn,
    onSuccessMsg = "Files Uploaded",
    onFailFn,
  }) => {
    if (isNil(loanId) || isNil(files)) {
      console.error("Missing loanId");
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/upload_loan_docs/${loanId}`;
    const source = axios.CancelToken.source();
    /**
     const params = {
      name: "Create Loan Application",
      path: endpoint,
      payload,
      cancelSource: source,
      formData: true,
      includeQueryParams: true,
      errorTesting,
      onSuccessFn,
      };
      
      */

    await axiosPostRequest({
      name: "Upload Loan Docs",
      path: endpoint,
      files, // FormData with submission + files

      formData: true,
      // errorTesting: true,
      cancelSource: source,
      onSuccessFn,
      onSuccessMsg: onSuccessMsg,
      onFailFn,
    });
  };

  // -------------------------------------
  //  POST /files/upload_loan_sizer/{loanId}
  // -------------------------------------
  const uploadLoanSizer = async ({ loanId, data, onSuccessFn, onFailFn }) => {
    const endpoint = `${ROUTE_PREFIX}/upload_loan_sizer/${loanId}`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Upload Loan Sizer",
      path: endpoint,
      payload: data, // FormData with submission + files
      cancelSource: source,
      onSuccessFn,
      onFailFn,
    };
    await axiosPostRequest(params);
  };

  // -------------------------------------
  //  POST /files/update_loan_doc_metadata/{loanId}
  // -------------------------------------
  const updateLoanDocMetadata = async ({
    loanId,
    data,
    onSuccessFn,
    onFailFn,
  }) => {
    const endpoint = `${ROUTE_PREFIX}/update_loan_doc_metadata/${loanId}`;
    const source = axios.CancelToken.source();

    const successMsg =
      size(data) > 1 ? "Loan Files Updated" : "Loan Files Updated";
    await axiosPostRequest({
      name: "Update Loan Doc Metadata",
      path: endpoint,
      payload: data, // typically an array of JSON objects
      cancelSource: source,
      onSuccessFn,
      onSuccessMsg: successMsg,
      onFailFn,
      // errorTesting: true,
    });
  };

  // -------------------------------------
  //  GET /files/download_loan_docs/{loanId}
  // -------------------------------------
  const downloadLoanDocs = async ({
    loanId,
    fileDownloadName,
    onSuccessFn,
    onFailFn,
  }) => {
    const endpoint = `${ROUTE_PREFIX}/download_loan_docs/${loanId}`;
    const source = axios.CancelToken.source();

    await axiosGetRequest({
      name: "Download Loan Docs",
      path: endpoint,
      cancelSource: source,
      onSuccessFn,
      onFailFn,
      isFile: true,
      fileDownload: true,
      fileDownloadName,
      // You may want to configure axios to handle binary data
      // (e.g. responseType: "blob") if you're actually downloading files
    });
  };

  // -------------------------------------
  //  GET /files/file_by_id/{loanId}/{file_storage_name}
  // -------------------------------------
  const getFileById = useCallback(
    async ({
      loanId,
      file_storage_name,
      isFile = true,
      fileDownloadName,
      onSuccessFn,
      fileDownload,
      openInNewTab,
      onFailFn,
    }) => {
      console.log({ loanId, file_storage_name });
      if (!loanId || !file_storage_name) {
        console.error("Missing loanId or file_storage_name");
        // setError("Missing loanId or file_storage_name");
        // setLoading(false);
        return;
      }
      const endpoint = `${ROUTE_PREFIX}/file_by_id/${loanId}/${file_storage_name}`;
      const source = axios.CancelToken.source();
      const params = {
        name: "Get File By Id",
        path: endpoint,
        cancelSource: source,
        isFile,
        fileDownloadName,
        fileDownload,
        openInNewTab,
        onSuccessFn,
        onFailFn,
      };
      await axiosGetRequest(params);
    },
    [axiosGetRequest]
  );

  // -------------------------------------
  //  GET /files/download_pipeline/{pipeline_criteria}
  // -------------------------------------
  const downloadPipeline = async ({
    pipelineCriteria = "all_deals", // 'all_deals' || 'underwriting' || 'closed'
    onSuccessFn,
    onFailFn,
  }) => {
    const endpoint = `${ROUTE_PREFIX}/download_pipeline/${pipelineCriteria}`;
    const source = axios.CancelToken.source();
    const shorthandDate = format(new Date(), "M-d-yy");
    const file_name = `Loan Pipeline - ${shorthandDate}`;
    const params = {
      name: "Download Pipeline",
      path: endpoint,
      cancelSource: source,
      isFile: true,
      fileDownload: true,
      fileDownloadName: file_name,
      onSuccessFn,
      onFailFn,
      // Possibly set { responseType: "blob" } if you're downloading an Excel
    };
    await axiosGetRequest(params);
  };

  const downloadLoanUploadTemplate = async ({ onSuccessFn, onFailFn }) => {
    const endpoint = `${ROUTE_PREFIX}/get_deal_upload_template`;
    const source = axios.CancelToken.source();

    const file_name = `Quick Intake Loan Template`;

    await axiosGetRequest({
      name: "Download Loan Upload Template",
      path: endpoint,
      cancelSource: source,
      isFile: true,
      fileDownload: true,
      fileDownloadName: file_name,
      onSuccessFn,
      onFailFn,
      // Possibly set { responseType: "blob" } if you're downloading an Excel
    });
  };

  return {
    error,
    loading,

    // POST
    uploadPipelineFiles,
    uploadLoanDocs,
    uploadLoanSizer,
    updateLoanDocMetadata,

    // GET
    downloadLoanUploadTemplate,
    downloadLoanDocs,
    getFileById,
    downloadPipeline,
  };
};
