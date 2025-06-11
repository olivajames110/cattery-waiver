import { combineReducers } from "redux";
import cachedDataReducer from "./cachedDataReducer";
import loanDrilldownReducer from "./loanDrilldownReducer";
import userReducer from "./userReducer";
import sidebarReducer from "./sidebarReducer";
import usersReducer from "./usersReducer";
import loanPipelineReducer from "./loanPipelineReducer";
import navSidebarReducer from "./navSidebarReducer";

const rootReducer = combineReducers({
  cachedData: cachedDataReducer,
  user: userReducer,
  users: usersReducer,
  navSidebar: navSidebarReducer,
  sidebar: sidebarReducer,
  loanPipeline: loanPipelineReducer,
  loanDrilldown: loanDrilldownReducer,
});

export default rootReducer;
