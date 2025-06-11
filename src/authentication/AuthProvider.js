// AuthProvider.jsx
import { useDispatch } from "react-redux";

const AuthProvider = ({ children }) => {
  // const { session } = useStytchSession();
  // const { user, authenticated } = useStytch();
  //   const stytchClient = useStytchB2BClient();
  // const sessionToken = stytchClient.session.getTokens()?.session_token;
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (authenticated && user) {
  //     // User is authenticated, update Redux store
  //     dispatch(
  //       userActionSet({
  //         id: user.id,
  //         email: user.emails[0]?.email,
  //         stytch_user: user,
  //         // Add any other user info you need
  //       })
  //     );
  //   } else {
  //     // User is not authenticated, clear user data
  //     dispatch(userActionClear());
  //   }
  // }, [authenticated, user, dispatch]);

  return children;
};

export default AuthProvider;
