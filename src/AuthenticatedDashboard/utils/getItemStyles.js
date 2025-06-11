export const getItemStyles = ({ theme, isActive, collapsed }) => ({
  padding: "12px 8px",
  fontSize: "12.8px",
  borderRadius: "4px",
  display: "flex",
  gap: "6px",
  alignItems: "center",
  justifyContent: collapsed ? "center" : "flex-start",
  textWrap: "nowrap",
  fontFamily: "var(--primaryFont)",
  // fontFamily: "var(--inter)",
  fontWeight: isActive ? 700 : 500,
  background: isActive ? "#2962ff1f" : "none",
  color: isActive ? theme.palette.primary.main : "inherit",
  borderRight: isActive
    ? `4px solid ${theme.palette.primary.main}`
    : "4px solid transparent",
  width: "100%",
  textDecoration: "none",
  zIndex: 111,
  cursor: "pointer",
});
