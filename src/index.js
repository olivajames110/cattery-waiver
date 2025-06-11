import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Redux + MUI + etc
import { ThemeProvider } from "@mui/material";
import { configureStore } from "@reduxjs/toolkit";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";

// === Stytch B2B imports ===

// Your own modules
import AuthenticatedDashboard from "./AuthenticatedDashboard";
import ProtectedRoute from "./authentication/ProtectedRoute";
import generateMuiThemeDefaults from "./functions/generateMuiThemeDefaults";
import "./index.css";
import rootReducer from "./redux/reducers";
import LoginScreen from "./screens/LoginScreen";

// AG Grid
import { LicenseManager } from "ag-grid-enterprise";
import Authenticate from "./authentication/Authenticate";
import CatteryWaiverScreen from "./screens/CatteryWaiverScreen";
import WaiverSearchScreen from "./screens/WaiverSearchScreen";
LicenseManager.setLicenseKey(process.env.REACT_APP_AG_GRID_ENTERPRISE_KEY);

// Create Redux store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Determine which public token to use
const isProduction = process.env.NODE_ENV === "production";

// const stytchOptions = {
//   cookieOptions: {
//     opaqueTokenCookieName: "stytch_session",
//     jwtCookieName: "stytch_session_jwt",
//     path: "",
//     availableToSubdomains: false,
//     domain: "",
//   },
// };

// Create the B2B client
// const stytchB2BClient = new StytchB2BUIClient(stytchPublicToken, stytchOptions);

const primaryColor = "#2962ff";
// MUI-themed wrapper

// Mount the app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <SnackbarProvider maxSnack={5}>
        <ThemeProvider theme={generateMuiThemeDefaults({ primaryColor })}>
          <Routes>
            {/* Public Routes */}
            {/* <Route path="/login" element={<LoginScreen />} /> */}
            <Route path="/waiver/*" element={<CatteryWaiverScreen />} />
            <Route path={"/waivers"} element={<WaiverSearchScreen />} />
            <Route path="/authenticate" element={<Authenticate />} />

            {/* Private/Protected Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AuthenticatedDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </ThemeProvider>
      </SnackbarProvider>
    </BrowserRouter>
  </Provider>
);
// root.render(
//   <StytchB2BProvider stytch={stytchB2BClient}>
//     <Provider store={store}>
//       <BrowserRouter>
//         <SnackbarProvider maxSnack={5}>
//           <ThemeProvider theme={generateMuiThemeDefaults({ primaryColor })}>
//             <Routes>
//               {/* Public Routes */}
//               <Route path="/login" element={<LoginScreen />} />
//               <Route path="/waiver/*" element={<CatteryWaiverScreen />} />
//               <Route path={"/waivers"} element={<WaiverSearchScreen />} />
//               <Route path="/authenticate" element={<Authenticate />} />

//               {/* Private/Protected Routes */}
//               <Route
//                 path="/*"
//                 element={
//                   <ProtectedRoute>
//                     <AuthenticatedDashboard />
//                   </ProtectedRoute>
//                 }
//               />
//             </Routes>
//           </ThemeProvider>
//         </SnackbarProvider>
//       </BrowserRouter>
//     </Provider>
//   </StytchB2BProvider>
// );
