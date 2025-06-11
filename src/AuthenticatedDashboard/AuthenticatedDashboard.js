import { useEffect, useMemo } from "react";

import {
  AccountBalanceOutlined,
  ArticleOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";

import { isNil } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../_src_shared/DashboardLayout";
import { useUsersHook } from "../hooks/useUsersHook";
import { userActionSet } from "../redux/actions/userActions";
import { usersActionSet } from "../redux/actions/usersActions";

const AuthenticatedDashboard = ({ children }) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const navSidebarOpen = useSelector((state) => state?.navSidebar?.open);

  const open = useMemo(
    () => navSidebarOpen || isMobile,
    [navSidebarOpen, isMobile]
  );

  const navigate = useNavigate();

  // const handleLogoutUser = useCallback(async () => {
  //   await stytch.session.revoke();
  //   navigate("/");
  // }, [stytch, navigate]);

  const topLinks = useMemo(
    () => [
      {
        items: [
          {
            icon: <ArticleOutlined />,
            to: "/loans",
            label: "Loan Pipeline",
          },
          {
            icon: <AccountBalanceOutlined />,
            to: "/loan-applications",
            label: "Loan Applications",
          },
          {
            icon: <CreditScoreOutlined />,
            to: "/credit-authorizations",
            label: "Credit Authorizations",
          },
        ],
      },
    ],
    []
  );
  // const bottomLinks = useMemo(
  //   () => [
  //     {
  //       items: [
  //         {
  //           type: "logout",
  //           label: "Log Out",
  //           onClick: handleLogoutUser,
  //           icon: <LogoutOutlined sx={{ transform: "rotate(180deg)" }} />,
  //         },
  //       ],
  //     },
  //   ],
  //   []
  // );

  const { getLoggedInUser, getAllUsers } = useUsersHook();
  useEffect(() => {
    if (isNil(user)) {
      getLoggedInUser({
        onSuccessFn: (data) => dispatch(userActionSet(data)),
        onErrorFn: (err) => console.error("GetLoggedInUser error:", err),
      });
    }
    if (isNil(users)) {
      getAllUsers({
        onSuccessFn: (data) => dispatch(usersActionSet(data)),
        onErrorFn: (err) => console.error("GetAllUsers error:", err),
      });
    }
  }, []);

  return (
    <DashboardLayout topLinks={topLinks} open={open}>
      {children}
    </DashboardLayout>
  );
};

export default AuthenticatedDashboard;
