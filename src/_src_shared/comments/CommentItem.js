import { Avatar, Box, useTheme } from "@mui/material";
import { isNil, isString } from "lodash";
import { useMemo } from "react";
import Flx from "../../components/layout/Flx";
import Txt from "../../components/typography/Txt";
import HtmlTextEditor from "../../components/inputs/HtmlTextEditor";

import { format, isValid } from "date-fns";
import { useSelector } from "react-redux";
import { blue, blueGrey, grey } from "@mui/material/colors";
import { is } from "immutable";

const CommentItem = ({ createdDate, createdBy, htmlString, px = 1 }) => {
  const user = useSelector((state) => state.user);
  const currentUserEmail = useMemo(
    // () => "dev1@cliffcomortgage.com",
    () => user?.emailAddress,
    [user?.emailAddress]
  );
  const isSelf = useMemo(() => {
    return currentUserEmail === createdBy;
  }, [currentUserEmail, createdBy]);

  const theme = useTheme();
  const styles = useMemo(() => {
    const margin = 4;
    // const margin = 8;
    return {
      // pt: "24px",
      // pb: "12px",
      // pt: "24px",
      // pb: "12px",
      // px: px,
      // borderRadius: 5,
      mr: isSelf ? 0 : margin,
      ml: isSelf ? margin : 0,
      flexGrow: 1,
      justifyContent: isSelf ? "flex-end" : "flex-start",
      gap: 0.8,
      // mb: "8px",
      // backgroundColor:
      //   isSelf
      //     ? blue[50]
      //     : theme.palette.background.paper,
      // borderBottom: `1px solid ${theme.palette.separator}`,
    };
  }, [theme, px, isSelf]);
  return (
    <Flx sx={styles}>
      {isSelf ? null : <UserAvatar isSelf={isSelf} userEmail={createdBy} />}
      <Flx gap={0.5} column>
        <Flx gap={0.5} jb ac fw wrap>
          <CreatedByTitle>{createdBy}</CreatedByTitle>
          <CreatedDate>{createdDate}</CreatedDate>
        </Flx>

        <CommentBody isSelf={isSelf}>{htmlString}</CommentBody>
      </Flx>
      {isSelf ? <UserAvatar isSelf={isSelf} userEmail={createdBy} /> : null}
    </Flx>
  );
};

const CreatedByTitle = ({ children }) => {
  const styles = useMemo(() => {
    return {
      fontSize: "11px",
      fontWeight: 400,
      opacity: 0.7,
    };
  }, []);
  return <Txt sx={styles}>{children}</Txt>;
};

const UserAvatar = ({ userEmail, isSelf }) => {
  const users = useSelector((state) => state.users);
  const filteredUserInitials = useMemo(() => {
    const user = users?.find((u) => u.emailAddress === userEmail);
    if (isNil(user)) {
      return null;
    }
    const userName = user?.fullName;
    if (!userName) return "";
    const userNameInitials = userName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase();
    return userNameInitials;
  }, []);

  const styles = useMemo(() => {
    const size = 24;
    return {
      mt: 2.7,
      width: size,
      height: size,
      fontSize: `${size - 14}px`,

      backgroundColor: isSelf ? blueGrey[400] : grey[400],
    };
  }, []);

  return <Avatar sx={styles}>{filteredUserInitials}</Avatar>;
};

const CreatedDate = ({ children }) => {
  const theme = useTheme();
  if (isNil(children)) {
    return null;
  }
  return (
    <Txt
      body2
      sx={{
        fontWeight: 400,
        opacity: 0.6,
        color: theme.palette.text.secondary,
        fontSize: "10px",
      }}
    >
      {formatDateShort(children)}
    </Txt>
  );
};

const CommentBody = ({ children, isSelf }) => {
  const styles = useMemo(() => {
    return {
      borderRadius: 2,
      py: 0.5,
      px: 1.5,
      backgroundColor: isSelf ? "#e3f2fd8c" : grey[100],
      // backgroundColor: isSelf ? blue[50] : grey[50],
    };
  }, [isSelf]);

  if (isNil(children)) {
    return null;
  }

  return (
    <Box sx={styles}>
      <HtmlTextEditor
        value={children}
        readOnly
        placeholder="Start typing here..."
      />
    </Box>
  );
};

const formatDateShort = (d) => {
  let dateObject;

  // format(new Date(), "M-d-yy");
  if (isString(d)) {
    const isoConverted = isoToDate(d);
    dateObject = isoConverted;
  }

  if (!isValid(dateObject)) {
    console.warn("Date is not valid", dateObject);
    return;
  }

  return format(dateObject, "M/d/yyyy");
};

const isoToDate = (isoString) => {
  // Handle empty or non-string values
  if (!isoString || !isString(isoString)) {
    // console.warn("Invalid ISO input:", isoString);
    return null;
  }

  // Try to create a date object
  const date = new Date(isoString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    console.warn("Invalid ISO string format:", isoString);
    return null;
  }

  return date;
};

export default CommentItem;
