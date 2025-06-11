// import { useStytchB2BClient } from "@stytch/react/dist/StytchB2BContext-865b6947";
import axios from "axios";
import { isArray, isBoolean, isEmpty } from "lodash";
import { enqueueSnackbar, SnackbarContent, useSnackbar } from "notistack";
import { forwardRef, useCallback, useState } from "react";
import { getValueFromMappedObject } from "../utils/objects/getValueFromMappedObject";
import { useStytchB2BClient } from "@stytch/react/b2b";
import { Box, IconButton, Typography } from "@mui/material";
import {
  CheckCircle,
  CheckRounded,
  CloseRounded,
  Error,
  ErrorOutline,
  ReportProblemRounded,
} from "@mui/icons-material";
import Txt from "../components/typography/Txt";
import { grey, red } from "@mui/material/colors";
import CustomSnackbar from "../_src_shared/components/CustomSnackbar";
export const useAxiosHook = () => {
  const stytch = useStytchB2BClient();
  const tokens = stytch.session.getTokens();
  // console.log("tokens", tokens);
  const session_token = tokens?.session_token;
  // const session_token = tokens?.session_jwt;
  // Exported State
  const [axiosPostIsLoading, setAxiosPostIsLoading] = useState(false);
  const [axiosGetIsLoading, setAxiosGetIsLoading] = useState(false);
  const [axiosError, setAxiosError] = useState(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  // Map to your domain(s)
  const domainTypeMap = {
    default:
      "https://rtl-backend.ambitioussmoke-43b0762d.eastus.azurecontainerapps.io",

    errorTesting: "https://example.azurewebsites.net",
  };

  // -----------------------------------------
  // GET Request
  // -----------------------------------------
  const axiosGetRequest = useCallback(
    async ({
      name,
      type,
      path,
      responseType,
      onSuccessFn,
      onCompleteFn,
      onFailFn,
      onFailMsg,
      hideFailMsg,
      cancelSource,

      isFile, // Indicates it's a file request
      fileDownload, // New prop: only auto-download if this is true
      fileDownloadName,
      openInNewTab, // If you also want to keep the open-in-new-tab feature
    }) => {
      setAxiosGetIsLoading(true);

      console.log("<--------");
      console.log(
        `%cGET |>| ${name} || path --> ${getValueFromMappedObject(
          domainTypeMap,
          type
        )}/${path}`,
        "background: #08a6081e;"
      );

      // Set responseType to 'blob' if isFile is true, otherwise use the provided or default to 'json'
      const effectiveResponseType = isFile ? "blob" : responseType || "json";

      axios({
        url: `${getValueFromMappedObject(domainTypeMap, type)}/${path}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${session_token}`,
        },
        responseType: effectiveResponseType,
        cancelToken: cancelSource?.token,
      })
        .then((response) => {
          const responseData = response.data;

          // Handle file if isFile is true
          if (isFile) {
            // Create an object URL from the blob response
            const fileBlobUrl = window.URL.createObjectURL(responseData);

            // Extract filename from 'content-disposition' header, if available
            const contentDisposition = response.headers["content-disposition"];
            let filename = fileDownloadName || "download";
            if (contentDisposition) {
              const filenameMatch =
                contentDisposition.match(/filename=([^;]+)/);
              if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1].replace(/["']/g, "");
              }
            }

            // If openInNewTab is set, open in new tab (you can remove this if you only want to handle downloads)
            if (openInNewTab) {
              // Open in new tab
              const newTab = window.open(fileBlobUrl, "_blank");
              if (!newTab) {
                console.warn(
                  "Unable to open new tab; check browser pop-up settings."
                );
              }
              // Optionally revoke object URL later
              // window.setTimeout(() => {
              //   window.URL.revokeObjectURL(fileBlobUrl);
              // }, 2000);
            }
            // Only automatically download if fileDownload is explicitly true
            else if (fileDownload) {
              const a = document.createElement("a");
              a.href = fileBlobUrl;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(fileBlobUrl);
            }
          }

          console.log(
            `%cGET |<| ${name} || Response Data --> `,
            "background: #08a6083b;",
            isFile ? "File request handled" : responseData
          );
          console.log("-------->");

          if (onSuccessFn) {
            onSuccessFn(responseData, response);
          }
          if (onCompleteFn) {
            onCompleteFn(responseData);
          }
          setAxiosGetIsLoading(false);
        })
        .catch((err) => {
          console.log(
            `%cGET |<| ${name} || Error --> `,
            "background: #ff00001a;",
            err
          );
          console.log("-------->");

          if (axios.isCancel(err)) {
            console.error("CANCEL", err);
            return;
          }

          setAxiosError(err.message);

          if (!hideFailMsg) {
            enqueueSnackbar(
              onFailMsg
                ? onFailMsg
                : name
                  ? `Could not ${name}`
                  : "Could not fetch data",

              {
                autoHideDuration: 2800,
                anchorOrigin: {
                  vertical: "bottom", // bottom
                  horizontal: "right", // left || center || right
                },
                content: (key, message) => (
                  <CustomSnackbar
                    id={key}
                    message={message}
                    variant="error"
                    closeSnackbar={() => closeSnackbar(key)}
                  />
                ),
              }
            );
          }
          if (onCompleteFn) {
            onCompleteFn();
          }
          if (onFailFn) {
            onFailFn(err);
          }

          setAxiosGetIsLoading(false);
        });
    },
    [session_token]
  );

  // -----------------------------------------
  // POST Request

  const axiosPostRequest = useCallback(
    async ({
      name,
      path,
      payload = {},
      files,
      onSuccessFn,
      domain,
      onCompleteFn,
      onSuccessMsg,
      onFailFn,
      onFailMsg,
      hideFailMsg,
      cancelToken,
      headers,
      errorTesting = false,
      includeQueryParams,
      formData = false,
    }) => {
      setAxiosPostIsLoading(true);

      try {
        // 1. Attach query params to payload if requested
        if (isBoolean(includeQueryParams)) {
          if (includeQueryParams) {
            const urlParams = new URLSearchParams(window.location.search);
            payload.query_params = Object.fromEntries(urlParams.entries());
          } else {
            payload.query_params = {};
          }
        }

        // 2. Prepare the data & headers for the request
        let dataToSend = payload;
        const finalHeaders = {
          Authorization: `Bearer ${session_token}`,
          ...headers,
        };

        // If formData is true, convert the payload to FormData and set the header
        if (formData) {
          const formDataPayload = new FormData();

          // If you have an array of files passed in, assign it to payload.uploadMetadata
          if (isArray(files) && !isEmpty(files)) {
            payload.uploadMetadata = files;
          }

          const uploadMetadata = payload?.uploadMetadata || [];

          // 1) Loop through each file object, append the file, and remove it from the object
          uploadMetadata.forEach((fileObject) => {
            if (fileObject.file && fileObject.file instanceof File) {
              formDataPayload.append(
                "uploadFiles",
                fileObject.file,
                fileObject.id
              );
              // Remove `file` so it doesn't end up in submission JSON
              delete fileObject.file;
            }
          });

          // 2) Now append the entire (updated) payload as JSON
          formDataPayload.append("submission", JSON.stringify(payload));

          dataToSend = formDataPayload;
          finalHeaders["Content-Type"] = "multipart/form-data";
        }

        const type = errorTesting ? "errorTesting" : domain;

        // 3. Log request info
        console.log(
          "%c-----------------OUTGOING----------------->>",
          "background: #08a6081e;"
        );

        console.log(
          `%cPOST |>| ${name} || path --> ${getValueFromMappedObject(
            domainTypeMap,
            type
          )}/${path}`,
          "background: #08a6081e;"
        );
        console.log(
          `%cPOST |>| ${name} || payload --> `,
          "background: #08a6081e;",
          payload
        );
        console.log(
          "%c-----------------OUTGOING----------------->>",
          "background: #08a6081e;"
        );

        // 4. Make the request
        const response = await axios({
          url: `${getValueFromMappedObject(domainTypeMap, type)}/${path}`,
          method: "post",
          headers: finalHeaders,
          data: dataToSend,
          cancelToken,
        });

        // 5. Log success, handle success callbacks
        const responseData = response.data;
        console.log(
          `%cPOST |<| ${name} || Response Data --> `,
          "background: #08a6083b;",
          responseData
        );
        console.log("----------OUTGOING---------->>", "background: #08a6081e;");

        if (onSuccessMsg) {
          enqueueSnackbar(
            onSuccessMsg,

            {
              autoHideDuration: 2800,
              anchorOrigin: {
                vertical: "bottom", // bottom
                horizontal: "right", // left || center || right
              },
              content: (key, message) => (
                <CustomSnackbar
                  id={key}
                  message={message}
                  variant="success"
                  closeSnackbar={() => closeSnackbar(key)}
                />
              ),
            }
          );
        }

        if (onSuccessFn) {
          onSuccessFn(responseData);
        }
      } catch (err) {
        // 6. Log error, handle error callbacks
        console.log(
          "%c<<-----------------INCOMING-----------------",
          "background: #ff00001a;"
        );
        console.log(
          `%cPOST |<| ${name} || Error --> `,
          "background: #ff00001a;",
          err
        );
        console.log(
          "%c<<-----------------INCOMING-----------------",
          "background: #ff00001a;"
        );

        setAxiosError(err.response?.data);

        if (!hideFailMsg) {
          enqueueSnackbar(
            onFailMsg
              ? onFailMsg
              : name
                ? `Could not ${name}`
                : "Could not submit data",

            {
              autoHideDuration: 2800,
              anchorOrigin: {
                vertical: "bottom", // bottom
                horizontal: "right", // left || center || right
              },
              content: (key, message) => (
                <CustomSnackbar
                  id={key}
                  message={message}
                  variant="error"
                  closeSnackbar={() => closeSnackbar(key)}
                />
              ),
            }
          );
        }

        if (onFailFn) {
          onFailFn(err);
        }
      } finally {
        // 7. Clean up, ensure loading state is reset
        if (onCompleteFn) {
          onCompleteFn();
        }
        setAxiosPostIsLoading(false);
      }
    },
    [session_token]
  );

  return {
    axiosPostIsLoading,
    axiosGetIsLoading,
    axiosError,
    axiosGetRequest,
    axiosPostRequest,
  };
};
