import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// Redux + MUI + etc
import { ThemeProvider } from "@mui/material";
import { configureStore } from "@reduxjs/toolkit";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";

// === Stytch B2B imports ===

// Your own modules
import generateMuiThemeDefaults from "./functions/generateMuiThemeDefaults";
import "./index.css";
import rootReducer from "./redux/reducers";

// AG Grid
import { LicenseManager } from "ag-grid-enterprise";
import Authenticate from "./authentication/Authenticate";
import WaiverFormScreen from "./screens/WaiverFormScreen";
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

const primaryColor = "#2962ff";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <SnackbarProvider maxSnack={5}>
        <ThemeProvider theme={generateMuiThemeDefaults({ primaryColor })}>
          <Routes>
            <Route path="/" element={<WaiverFormScreen />} />
            <Route path="/waiver/*" element={<WaiverFormScreen />} />
            {/* <Route path="/login" element={<LoginScreen />} /> */}
            <Route path="/authenticate" element={<Authenticate />} />
            <Route path="/waivers" element={<WaiverSearchScreen />} />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ThemeProvider>
      </SnackbarProvider>
    </BrowserRouter>
  </Provider>
);
