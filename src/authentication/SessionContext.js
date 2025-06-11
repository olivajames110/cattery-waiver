// import { isFunction } from "lodash";
// import React, { createContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuthHook } from "./hooks/useAuthHook";
// import { useDispatch } from "react-redux";
// import {
//   sessionIdClearId,
//   sessionIdSetId,
// } from "./redux/actions/sessionIdActions";

// export const SessionContext = createContext(null);

// export const SessionProvider = ({ children }) => {
//   const [session, setSession] = useState(null);
//   const { loading, validateSession } = useAuthHook();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   // const [authToken, setSessionId] = useLocalStorage("authToken");
//   // const loading = true;

//   useEffect(() => {
//     // On mount, try to load existing session from localStorage
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       validateSession({
//         sessionId: token,
//         onSuccessFn: (d) => {
//           dispatch(sessionIdSetId(token));
//           setSession({
//             token,
//             user: d,
//           });
//         },
//         onFailFn: () => {
//           logout();
//         },
//       });
//     } else {
//       logout();
//     }
//   }, []);

//   const validate = (tkn, params) => {
//     localStorage.setItem("authToken", tkn);
//     validateSession({
//       sessionId: tkn,
//       onSuccessFn: (d) => {
//         setSession({
//           tkn,
//           user: d,
//         });

//         if (isFunction(params?.onSuccessFn)) {
//           params?.onSuccessFn();
//         }
//       },
//       onFailFn: () => {
//         logout();
//       },
//     });
//   };

//   const logout = () => {
//     localStorage.removeItem("authToken");
//     setSession(null);
//     dispatch(sessionIdClearId());
//     navigate("/login");
//   };

//   const value = {
//     session,
//     // login,
//     logout,
//     loading,
//     validate,
//   };

//   return (
//     <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
//   );
// };

// // Example: fetch user data with a given token
// // async function fetchUserData(token) {
// //   const response = await fetch("/api/user", {
// //     headers: { Authorization: `Bearer ${token}` },
// //   });
// //   if (!response.ok) throw new Error("Failed to fetch user data");
// //   return await response.json();
// // }

// // // Example: authenticate user and return a token
// // async function authenticateUser(username, password) {
// //   const response = await fetch("/api/login", {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify({ username, password }),
// //   });
// //   if (!response.ok) throw new Error("Login failed");
// //   return await response.json();
// // }
