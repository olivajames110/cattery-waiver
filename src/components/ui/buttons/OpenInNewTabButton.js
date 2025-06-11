import { OpenInNewRounded } from "@mui/icons-material";
import { Link } from "@mui/material";
import { isNil } from "lodash";

const OpenInNewTabButton = ({ to, href, linkIcon, size, sx, children }) => {
  const sizes = {
    sm: ".8rem",
    md: "1rem",
    lg: "1.2rem",
  };
  const dynamic_size = isNil(sizes[size]) ? size : sizes[size];
  const button_size = isNil(size) ? sizes["md"] : dynamic_size;

  const content = children ? (
    children
  ) : (
    <OpenInNewRounded
      sx={{
        display: "block",
        fontSize: button_size,
        color: "var(--primary)",
        ...sx,
      }}
    />
  );

  return (
    <Link
      color={"primary"}
      sx={{ display: "flex", alignItems: "center", ...sx }}
      href={href ? href : `${window.location.origin}${to}`}
      target="_blank"
      rel="noreferrer"
    >
      {content}
      {linkIcon ? (
        <OpenInNewRounded
          sx={{
            display: "block",
            fontSize: ".95em",
            marginLeft: "2px",
            color: "var(--primary)",
            ...sx,
          }}
        />
      ) : null}
    </Link>
  );
};

export default OpenInNewTabButton;
