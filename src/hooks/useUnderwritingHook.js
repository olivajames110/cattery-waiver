import axios from "axios";
import { useAxiosHook } from "./useAxiosHook";
import { isArray, isEmpty, isNil } from "lodash";

const ROUTE_PREFIX = "underwriting";

export const useUnderwritingHook = () => {
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
  //  WORKING
  //  GET /underwriting/underwriting_pipeline
  // -------------------------------------
  const getUnderwritingPipeline = async ({
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    const endpoint = `${ROUTE_PREFIX}/underwriting_pipeline`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Get Underwriting Pipeline",
      path: endpoint,
      cancelSource: source,
      onSuccessFn,
      onCompleteFn,
      onFailFn,
    };
    await axiosGetRequest(params);
  };

  const populateLoanFormFromExcel = async ({
    excel,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    if (isNil(excel) || isEmpty(excel)) {
      console.error("Excel file is missing", { excel });
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/new_loan/populate_loan_form`;
    const source = axios.CancelToken.source();

    // console.log("excel", excel);
    // return;
    await axiosPostRequest({
      name: "Populate Loan Form From Excel",
      path: endpoint,
      // files: { uploadMetadata: [excel] }, // FormData with submission + files
      files: [excel], // FormData with submission + files
      formData: true,
      // errorTesting: true,
      cancelSource: source,
      onSuccessFn,
      onCompleteFn,
      onFailFn,
    });
  };

  // -------------------------------------
  // TO DO
  //  POST /underwriting/create_loan_file_uploads
  // -------------------------------------
  /**
   * Creates a new loan with file uploads
   *
   * @example
   * // Example usage:
   * const formData = new FormData();
   *
   * // Add loan data as JSON string
   * const loanData = {
   *   loanNumber: "L12345",
   *   loanAmount: 500000,
   *   term: 30,
   *   interestRate: 4.5,
   *   propertyAddress: "123 Main St",
   *   borrowerName: "John Smith",
   *   uploadMetadata: [
   *     {
   *       fileName: "appraisal.pdf",
   *       documentType: "Appraisal",
   *       documentDescription: "Property appraisal report"
   *     },
   *     {
   *       fileName: "credit_report.pdf",
   *       documentType: "Credit Report",
   *       documentDescription: "Borrower credit history"
   *     }
   *   ]
   * };
   *
   * formData.append('submission', JSON.stringify(loanData));
   *
   * // Add the actual files
   * formData.append('uploadFiles', appraisalFile);
   * formData.append('uploadFiles', creditReportFile);
   *
   * createLoanWithFileUploads({
   *   formData,
   *   onSuccessFn: (response) => console.log("Loan created with files:", response),
   *   onCompleteFn,onFailFn: (error) => console.error("Error creating loan with files:", error)
   * });
   */
  const createLoanWithFileUploads = async ({
    data,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    if (isNil(data) || isEmpty(data)) {
      console.error("Form data is missing", { data });
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/create_loan_file_uploads`;
    const source = axios.CancelToken.source();

    await axiosPostRequest({
      name: "Create Loan With File Uploads",
      path: endpoint,
      formData: true,
      payload: data,
      cancelSource: source,
      onSuccessFn,
      // errorTesting: true,
      onCompleteFn,
      onFailFn,
    });
  };

  const createLoanFromApplication = async ({
    applicationId,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    if (isNil(applicationId)) {
      console.error("applicationId is missing", { applicationId });
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/create_deal_from_submission/loanApplication/${applicationId}`;
    const source = axios.CancelToken.source();

    await axiosPostRequest({
      name: "Create Loan From Application",
      path: endpoint,
      // formData: true,

      cancelSource: source,
      onSuccessFn,

      onCompleteFn,
      onFailFn,
    });
  };

  // -------------------------------------
  // SETUP
  //  POST /underwriting/create_loan
  // -------------------------------------
  /**
   * Creates a new loan
   *
   * @example
   * // Example usage:
   * const loanData = {
   *   loanNumber: "L12345",
   *   loanAmount: 500000,
   *   term: 30,
   *   interestRate: 4.5,
   *   propertyAddress: "123 Main St",
   *   borrowerName: "John Smith",
   *   loanType: "Commercial",
   *   loanPurpose: "Purchase",
   *   propertyType: "Retail"
   * };
   *
   * createLoan({
   *   data: loanData,
   *   onSuccessFn: (response) => console.log("Loan created:", response),
   *   onCompleteFn,onFailFn: (error) => console.error("Error creating loan:", error)
   * });
   */
  const createLoan = async ({ data, onSuccessFn, onCompleteFn, onFailFn }) => {
    if (isNil(data) || isEmpty(data)) {
      console.error("Loan data is missing", { data });
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/create_loan`;
    const source = axios.CancelToken.source();

    await axiosPostRequest({
      name: "Create Loan",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessFn,
      onSuccessMsg: "Loan created successfully",
      onCompleteFn,
      onFailFn,
    });
  };

  const getLoanById = async ({
    loanId,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    const endpoint = `${ROUTE_PREFIX}/loan/${loanId}`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Get Loan By ID",
      path: endpoint,
      cancelSource: source,
      onSuccessFn,
      onCompleteFn,
      onFailFn,
    };
    await axiosGetRequest(params);
  };

  const updateLoanData = async ({
    loanId,
    data,
    onSuccessFn,
    onSuccessMsg = "Loan data updated successfully",
    onCompleteFn,
    onFailFn,
  }) => {
    if (isNil(loanId) || isNil(data) || isEmpty(data)) {
      console.error("Loan ID or Data is missing", { loanId, data });
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/update_loan_data/${loanId}`;
    const source = axios.CancelToken.source();

    await axiosPostRequest({
      name: "Update Loan Data",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessFn,
      onSuccessMsg: onSuccessMsg,
      // errorTesting: true,
      onCompleteFn,
      onFailFn,
    });
  };

  const updateUnderwritingNotes = async ({
    loanId,
    data,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    if (isNil(loanId) || isNil(data) || isEmpty(data)) {
      console.error("Loan ID or Data is missing", { loanId, data });
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/underwritingNotes/${loanId}`;
    const source = axios.CancelToken.source();

    await axiosPostRequest({
      name: "Update Underwriting Notes",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessFn,
      // errorTesting: true,
      onSuccessMsg: "Underwriting notes updated successfully",
      onCompleteFn,
      onFailFn,
    });
  };

  const updateMilestoneStatus = async ({
    loanId,
    loanStatus,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    if (isNil(loanId) || isNil(loanStatus)) {
      console.error("Loan ID or Loan Status is missing", {
        loanId,
        loanStatus,
      });
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/update_milestone/${loanId}`;
    const source = axios.CancelToken.source();

    await axiosPostRequest({
      name: "Update Milestone Status",
      path: endpoint,
      payload: { loanStatus },
      cancelSource: source,
      onSuccessFn,
      onSuccessMsg: `Milestone status updated successfully to ${loanStatus}`,
      // errorTesting: true,
      onCompleteFn,
      onFailFn,
    });
  };

  const createDealComment = async ({
    loanId,
    data,
    onSuccessFn,
    onCompleteFn,
    testing = false,
    onFailFn,
  }) => {
    if (isNil(loanId) || isNil(data) || isEmpty(data)) {
      console.error("Loan ID or Data is missing", { loanId, data });
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/create_comment/${loanId}`;
    const source = axios.CancelToken.source();

    await axiosPostRequest({
      name: "Create Deal Comment",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessFn,
      errorTesting: testing,
      onCompleteFn,
      onFailFn,
    });
  };

  const addPermittedUserToLoan = async ({
    loanId,
    emailAddress,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    if (isNil(loanId) || isNil(emailAddress)) {
      console.error("Loan ID or Data is missing", { loanId, emailAddress });
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/add_permitted_users/${loanId}`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Add Permitted User To Loan",
      path: endpoint,
      payload: {
        emailAddress: emailAddress,
      },
      cancelSource: source,
      onSuccessFn,
      onCompleteFn,
      onFailFn,
    };
    await axiosPostRequest(params);
  };

  const updateLoanPermittedUsers = async ({
    loanId,
    permittedUsers,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    if (isNil(loanId) || isNil(permittedUsers) || !isArray(permittedUsers)) {
      console.error("Loan ID or Data is missing", { loanId, permittedUsers });
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/add_permitted_users/${loanId}`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Add Permitted User To Loan",
      path: endpoint,
      payload: {
        permittedUsers,
      },
      cancelSource: source,
      onSuccessFn,
      onCompleteFn,
      onFailFn,
    };
    await axiosPostRequest(params);
  };

  const createUnnestedObject = async ({
    objectName, //  titleReport', 'underwritingCheckList', 'loanLock', 'borrowerEntity'
    loanId,
    data,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    if (isNil(loanId) || isNil(objectName) || isNil(data)) {
      console.error("Loan ID, Object Name, or Data is missing", {
        loanId,
        objectName,
        data,
      });
      return;
    }

    /**
     * If updated, also update in UnderwritingRouteCard.js
     */
    const objectNameOptions = [
      "titleReport",
      "underwritingCheckList",
      "loanLock",
      "borrowerEntity",
    ];
    if (!objectNameOptions.includes(objectName)) {
      console.error("Invalid object name", { objectName });
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/create_object/${objectName}/${loanId}`;
    const source = axios.CancelToken.source();

    await axiosPostRequest({
      name: "Create Unnested Object",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessFn,

      onCompleteFn,
      onFailFn,
    });
  };

  const updateUnnestedObject = async ({
    objectName, //  titleReport', 'underwritingCheckList', 'loanLock', 'borrowerEntity'
    loanId,
    data,
    onSuccessFn,
    onCompleteFn,
    onSuccessMsg = "Updated successfully",
    onFailFn,
  }) => {
    if (isNil(loanId) || isNil(objectName) || isNil(data)) {
      console.error("Loan ID, Object Name, or Data is missing", {
        loanId,
        objectName,
        data,
      });
      return;
    }
    /**
     * If updated, also update in UnderwritingRouteCard.js
     */
    const objectNameOptions = [
      "titleReport",
      "underwritingCheckList",
      "loanLock",
      "borrowerEntity",
    ];
    if (!objectNameOptions.includes(objectName)) {
      console.error("Invalid object name", { objectName });
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/update_object/${objectName}/${loanId}`;
    const source = axios.CancelToken.source();

    await axiosPostRequest({
      name: "Update Unnested Object",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessFn,
      onSuccessMsg,
      // errorTesting: true,

      onCompleteFn,
      onFailFn,
    });
  };

  const createLoanException = async ({
    loanId,
    data,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    if (isNil(loanId) || isNil(data) || isEmpty(data)) {
      console.error("Loan ID or Data is missing", { loanId, data });
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/create_loan_exception/${loanId}`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Create Loan Exception",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessFn,
      onCompleteFn,
      onFailFn,
    };
    await axiosPostRequest(params);
  };

  const createObjectInList = async ({
    objectName,
    loanId,
    data,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    const endpoint = `${ROUTE_PREFIX}/create_list_object/${objectName}/${loanId}`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Create Object In List",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessFn,
      onCompleteFn,
      onFailFn,
    };
    await axiosPostRequest(params);
  };

  const updateObjectInList = async ({
    objectName,
    loanId,
    _id,
    data,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    const endpoint = `${ROUTE_PREFIX}/update_list_object/${objectName}/${loanId}/${_id}`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Update Object In List",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessFn,
      onCompleteFn,
      onFailFn,
    };
    await axiosPostRequest(params);
  };

  const createSubjectProperty = async ({
    loanId,
    propertyData,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    if (isNil(loanId) || isNil(propertyData)) {
      console.error("Loan ID or propertyData is missing", {
        loanId,
        propertyData,
      });
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/create_subject_property/${loanId}`;
    const source = axios.CancelToken.source();

    await axiosPostRequest({
      name: "Create Subject Property",
      path: endpoint,
      payload: propertyData,
      cancelSource: source,
      onSuccessMsg: "Property created successfully",
      onSuccessFn,
      onCompleteFn,
      onFailFn,
    });
  };

  const updateSubjectProperty = async ({
    loanId,
    propertyId,
    data,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    const endpoint = `${ROUTE_PREFIX}/update_subject_property/${loanId}/${propertyId}`;
    const source = axios.CancelToken.source();
    if (isNil(loanId) || isNil(propertyId) || isNil(data)) {
      console.error("Loan ID or Property ID is missing", {
        loanId,
        propertyId,
        data,
      });
      return;
    }

    await axiosPostRequest({
      name: "Update Subject Property",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessMsg: "Property updated successfully",
      // errorTesting: true,
      onSuccessFn,
      onCompleteFn,
      onFailFn,
    });
  };

  const createBorrower = async ({
    loanId,
    borrower,

    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    const endpoint = `${ROUTE_PREFIX}/create_borrower/${loanId}`;
    const source = axios.CancelToken.source();

    if (isNil(loanId) || isNil(borrower)) {
      console.error("Loan ID or Borrower data is missing", {
        loanId,
        borrower,
      });
      return;
    }
    await axiosPostRequest({
      name: "Create Borrower",
      path: endpoint,
      payload: borrower,
      cancelSource: source,
      onSuccessMsg: "Borrower created successfully",

      onSuccessFn,
      onCompleteFn,
      onFailFn,
    });
  };

  // -------------------------------------
  // WORKING
  //  POST /underwriting/update_borrower/{loanId}/{_id}
  // -------------------------------------
  /**
   * Updates an existing borrower for a deal
   *
   * @example
   * // Example usage:
   * const updatedBorrowerData = {
   *   _id: "60a1e2c3d4e5f6a7b8c9d0e3", // Must match the _id in the URL
   *   firstName: "John",
   *   lastName: "Smith",
   *   email: "john.smith@newdomain.com", // Updated value
   *   phone: "512-555-9876", // Updated value
   *   address: "456 Oak Lane",
   *   city: "Austin",
   *   state: "TX",
   *   zipCode: "78702",
   *   ssn: "123-45-6789",
   *   dateOfBirth: "1980-05-15",
   *   creditScore: 780, // Updated value
   *   annualIncome: 135000 // Updated value
   * };
   *
   * updateBorrower({
   *   loanId: "60a1e2c3d4e5f6a7b8c9d0e1",
   *   _id: "60a1e2c3d4e5f6a7b8c9d0e3",
   *   data: updatedBorrowerData,
   *
   * onSuccessFn: (response) => console.log("Borrower updated:", response),
   *   onCompleteFn,onFailFn: (error) => console.error("Error updating borrower:", error)
   * });
   */
  const updateBorrower = async ({
    loanId,
    borrowerId,
    data,

    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    if (isNil(loanId) || isNil(borrowerId) || isNil(data)) {
      console.error("Loan ID or Borrower ID is missing", {
        loanId,
        borrowerId,
        data,
      });
      return;
    }
    const endpoint = `${ROUTE_PREFIX}/update_borrower/${loanId}/${borrowerId}`;
    const source = axios.CancelToken.source();

    await axiosPostRequest({
      name: "Update Borrower",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessMsg: "Borrower updated successfully",

      onSuccessFn,
      onCompleteFn,
      onFailFn,
    });
  };

  // -------------------------------------
  // TO DO
  //  POST /underwriting/assign_to_deal/{borrower_submission}/{loanNumber}
  // -------------------------------------
  /**
   * Assigns a borrower submission to a loan
   *
   * @example
   * // Example usage:
   * // For a loan application submission:
   * const applicationData = {
   *   _id: "60a1e2c3d4e5f6a7b8c9d0e4", // ID of the submission to assign
   *   applicationType: "Commercial",
   *   applicationDate: "2023-04-15T14:30:00Z",
   *   loanAmount: 950000,
   *   loanPurpose: "Purchase",
   *   loanTerm: 30,
   *   propertyAddress: "789 Pine Ave",
   *   propertyCity: "Austin",
   *   propertyState: "TX",
   *   propertyZipCode: "78703"
   * };
   *
   * assignSubmissionToDeal({
   *   borrower_submission: "application", // Can be "application" or "creditAuth"
   *   loanNumber: "12345",
   *   data: applicationData,
   *   onSuccessFn: (response) => console.log("Application assigned:", response),
   *   onCompleteFn,onFailFn: (error) => console.error("Error assigning application:", error)
   * });
   *
   * // For a credit authorization submission:
   * const creditAuthData = {
   *   _id: "60a1e2c3d4e5f6a7b8c9d0e5", // ID of the submission to assign
   *   authorizationDate: "2023-04-10T09:45:00Z",
   *   creditPurpose: "Loan Underwriting",
   *   borrowerName: "John Smith",
   *   borrowerSSN: "123-45-6789",
   *   borrowerDOB: "1980-05-15",
   *   authorizationSignature: true,
   *   authorizationSignatureDate: "2023-04-10T09:45:00Z"
   * };
   *
   * assignSubmissionToDeal({
   *   borrower_submission: "creditAuth", // Can be "application" or "creditAuth"
   *   loanNumber: "12345",
   *   data: creditAuthData,
   *   onSuccessFn: (response) => console.log("Credit auth assigned:", response),
   *   onCompleteFn,onFailFn: (error) => console.error("Error assigning credit auth:", error)
   * });
   */
  const assignSubmissionToDeal = async ({
    borrower_submission,
    loanNumber,
    data,
    onSuccessFn,
    onCompleteFn,
    onFailFn,
  }) => {
    const endpoint = `${ROUTE_PREFIX}/assign_to_deal/${borrower_submission}/${loanNumber}`;
    const source = axios.CancelToken.source();
    const params = {
      name: "Assign Submission To Deal",
      path: endpoint,
      payload: data,
      cancelSource: source,
      onSuccessFn,
      onCompleteFn,
      onFailFn,
    };
    await axiosPostRequest(params);
  };

  return {
    error,
    loading,

    // GET calls
    getUnderwritingPipeline,
    getLoanById,

    // POST calls
    // createNewLoan,
    // newLoanFromExcel,
    // populateProspectFromExcel,
    // createLoanFileUploads,
    // postUpdateUwNotes,
    updateLoanData,
    updateMilestoneStatus,
    createDealComment,
    createUnnestedObject,
    createSubjectProperty,
    updateSubjectProperty,
    createBorrower,
    updateBorrower,
    assignSubmissionToDeal,
    updateLoanPermittedUsers,
    // importLoanFromExcel,
    // populateLoanFormFromExcel,
    populateLoanFormFromExcel,
    createLoanWithFileUploads,
    createLoan,
    updateUnderwritingNotes,
    addPermittedUserToLoan,
    updateUnnestedObject,
    createLoanException,
    createObjectInList,
    updateObjectInList,
    createLoanFromApplication,
  };
};
