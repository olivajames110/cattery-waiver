// import { Box, useTheme } from "@mui/material";
// import React, { useMemo } from "react";
// import Htag from "../../typography/Htag";
// import { isNil } from "lodash";
// import Flx from "../../layout/Flx";

// const TitledGroup = ({
//   title,
//   children,
//   fw,
//   sx,
//   bodySx,
//   icon,
//   headerSx,
//   headerEndContent,
//   divider,
//   variant = "h3",
//   suppressPadding,
// }) => {
//   const rootStyles = useMemo(
//     () => ({
//       flexGrow: 1,
//       ...sx,
//       ...(fw && { width: "100%" }),
//       ...(suppressPadding && { padding: 0 }),
//     }),
//     [fw, sx, suppressPadding]
//   );

//   return (
//     <Box variant="outline" sx={rootStyles}>
//       <TitledGroupHeader
//         sx={headerSx}
//         divider={divider}
//         icon={icon}
//         variant={variant}
//         title={title}
//         headerEndContent={headerEndContent}
//       />
//       <Box sx={bodySx}>{children}</Box>
//     </Box>
//   );
// };

// const TitledGroupHeader = ({
//   divider,
//   sx,
//   icon,
//   headerEndContent,
//   variant,
//   title,
// }) => {
//   const theme = useTheme();

//   const headerStyles = useMemo(
//     () => ({
//       mt: 1,
//       mb: 2,
//       position: "relative",
//       color: "#656e76",
//       borderBottom: divider
//         ? `1px solid ${theme.palette.dividerLight}`
//         : "none",
//       ...sx,
//     }),
//     [divider, sx, theme.palette.dividerLight]
//   );

//   return (
//     <Box sx={headerStyles}>
//       <Flx fw jb ac>
//         <Flx ac sx={{ gap: 1 }}>
//           {icon && (
//             <Flx
//               center
//               sx={{
//                 color: "inherit",
//                 svg: {
//                   color: "inherit",
//                 },
//               }}
//             >
//               {icon}
//             </Flx>
//           )}
//           {!isNil(title) && (
//             <Htag sx={{ color: "inherit" }} variant={variant}>
//               {title}
//             </Htag>
//           )}
//         </Flx>
//         {headerEndContent}
//       </Flx>
//     </Box>
//   );
// };

// export default TitledGroup;
import { Box, useTheme } from "@mui/material";
import React, { useMemo } from "react";
import Htag from "../../typography/Htag";
import { isNil } from "lodash";
import Flx from "../../layout/Flx";
import { te } from "date-fns/locale";

/**
 * TitledGroup Component
 * @param {Object} props
 * @param {string} props.title - The title text
 * @param {React.ReactNode} props.children - Child components
 * @param {boolean} props.fw - Full width flag
 * @param {Object} props.sx - Style overrides for root
 * @param {Object} props.bodySx - Style overrides for body
 * @param {React.ReactNode} props.icon - Optional icon to display
 * @param {Object} props.headerSx - Style overrides for header
 * @param {React.ReactNode} props.headerEndContent - Optional content to display at end of header
 * @param {boolean} props.divider - Whether to show divider beneath header
 * @param {string} props.variant - Title size variant ('h2'|'h3'|'h4'), default 'h3'
 * @param {boolean} props.suppressPadding - Whether to remove default padding
 */

const paddingAmt = 2;
const TitledGroup = ({
  title,
  children,
  fw,
  sx,
  icon,
  bodySx,
  headerSx,
  headerEndContent,
  divider,
  variant = "h3",
  suppressPadding,
  fontWeight = 600,
  suppressHeaderPadding,
  uppercase,
  suppressBodyPadding,
}) => {
  const cardRootStyles = useMemo(
    () => ({
      flexGrow: 1,

      ...sx,
      ...(fw && { width: "100%" }),
      ...(suppressPadding && { padding: 0 }),
    }),
    [fw, sx, suppressPadding]
  );

  return (
    <Box sx={cardRootStyles} className="titled-group-root">
      <TitledGroupHeader
        sx={headerSx}
        divider={divider}
        icon={icon}
        variant={variant}
        uppercase={uppercase}
        title={title}
        fontWeight={fontWeight}
        suppressHeaderPadding={suppressHeaderPadding}
        headerEndContent={headerEndContent}
      />

      <BodyContent suppressBodyPadding={suppressBodyPadding} sx={bodySx}>
        {children}
      </BodyContent>
    </Box>
  );
};

/**
 * Header component for TitledGroup
 */
const TitledGroupHeader = ({
  divider,
  sx,
  icon,
  headerEndContent,
  variant,
  title,
  fontWeight,
  suppressHeaderPadding,
  uppercase,
}) => {
  if (isNil(title) && isNil(headerEndContent)) return null;
  return (
    <TitledGroupHeaderRoot
      headerEndContent={headerEndContent}
      sx={sx}
      divider={divider}
      suppressHeaderPadding={suppressHeaderPadding}
    >
      <Flx ac sx={{ display: "flex", gap: 0.8 }}>
        {icon && <Icon>{icon}</Icon>}
        <Title fontWeight={fontWeight} uppercase={uppercase} variant={variant}>
          {title}
        </Title>
      </Flx>
    </TitledGroupHeaderRoot>
  );
};

/**
 * Root container for TitledGroupHeader
 */
const TitledGroupHeaderRoot = ({
  sx,
  divider,
  children,
  headerEndContent,
  suppressHeaderPadding,
}) => {
  const theme = useTheme();

  const styles = useMemo(
    () => ({
      // mt: 1,
      // pt: 1,
      // pb: 2,
      px: suppressHeaderPadding ? 0 : paddingAmt,
      pt: suppressHeaderPadding ? 0 : paddingAmt + 1,
      pb: 0,
      // mb: 2,
      position: "relative",
      color: "#0f1214",
      borderBottom: divider
        ? `1px solid ${theme.palette.dividerLight}`
        : "none",
      ...sx,
    }),
    [sx, divider, theme.palette.dividerLight, suppressHeaderPadding]
  );

  return (
    <Box sx={styles} className="titled-group-header-root">
      {headerEndContent ? (
        <Flx fw jb ac>
          {children}
          {headerEndContent}
        </Flx>
      ) : (
        children
      )}
    </Box>
  );
};

/**
 * Icon container component
 */
const Icon = ({ children }) => {
  if (isNil(children)) return null;

  return (
    <Flx
      center
      sx={{
        color: "inherit",
        svg: {
          color: "inherit",
        },
      }}
    >
      {children}
    </Flx>
  );
};

/**
 * Title component
 */
const Title = ({ children, variant, uppercase, fontWeight }) => {
  if (isNil(children)) return null;

  return (
    <Htag
      sx={{
        color: "inherit",
        textTransform: uppercase ? "uppercase" : "capitalize",
        // color: titleColor || "inherit",
        margin: 0,
        fontWeight: fontWeight,
      }}
      variant={variant}
    >
      {children}
    </Htag>
  );
};

const BodyContent = ({ suppressBodyPadding, sx, children }) => {
  const styles = useMemo(
    () => ({
      p: suppressBodyPadding ? 0 : paddingAmt,
      // pt: suppressBodyPadding ? 0 : paddingAmt - 1,

      position: "relative",
      // color: "#656e76",

      ...sx,
    }),
    [sx, suppressBodyPadding]
  );

  if (isNil(children)) return null;
  return (
    <Box className="titled-group-body-root" sx={styles}>
      {children}
    </Box>
  );
};

export default TitledGroup;
