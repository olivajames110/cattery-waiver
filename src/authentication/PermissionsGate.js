import { isFunction, isNil } from "lodash";
import React from "react";
import { useSelector } from "react-redux";

const PermissionsGate = ({
  // Single permission (case-insensitive), e.g. "admin"
  permission,

  // Role-based logic (case-insensitive arrays)
  anyOf = [], // e.g. ['admin', 'sales_admin']
  noneOf = [], // e.g. ['processor', 'borrower']

  // Email-based logic
  anyOfEmails = [], // e.g. ['jimmy@dev.com', 'chris@dev.com']
  noneOfEmails = [], // e.g. ['blocked@dev.com']

  // Fully custom logic
  customCheck, // e.g. (user) => user.member_id === 'xxx'

  children,
}) => {
  // Grab user from Redux
  const user = useSelector((state) => state.user);
  if (isNil(user)) {
    return null;
  }

  // Extract roles + email from user
  const userPermissions = user?.permissions || [];
  const userEmail = user?.emailAddress || "";

  // Convert the user's permissions to lowercase
  const userPermissionsLower = userPermissions.map((p) => p.toLowerCase());

  // Combine anyOf with the single permission (if provided), all lowercased
  const finalAnyOf = [
    ...anyOf.map((p) => p.toLowerCase()),
    ...(permission ? [permission.toLowerCase()] : []),
  ];

  // 1. Roles: "anyOf" (case-insensitive)
  const passesAnyOf = finalAnyOf.length
    ? userPermissionsLower.some((perm) => finalAnyOf.includes(perm))
    : true;

  // 2. Roles: "noneOf" (case-insensitive)
  const noneOfLower = noneOf.map((p) => p.toLowerCase());
  const passesNoneOf = noneOfLower.length
    ? !userPermissionsLower.some((perm) => noneOfLower.includes(perm))
    : true;

  // 3. Email: "anyOfEmails" (case-insensitive)
  const userEmailLower = userEmail.toLowerCase();
  const passesAnyOfEmails = anyOfEmails.length
    ? anyOfEmails.some((email) => email.toLowerCase() === userEmailLower)
    : true;

  // 4. Email: "noneOfEmails" (case-insensitive)
  const passesNoneOfEmails = noneOfEmails.length
    ? !noneOfEmails.some((email) => email.toLowerCase() === userEmailLower)
    : true;

  // 5. Custom logic (if provided)
  const passesCustomCheck = isFunction(customCheck) ? customCheck(user) : true;

  // Combine all conditions
  const isAllowed =
    passesAnyOf &&
    passesNoneOf &&
    passesAnyOfEmails &&
    passesNoneOfEmails &&
    passesCustomCheck;

  return isAllowed ? <>{children}</> : null;
};

export default PermissionsGate;
