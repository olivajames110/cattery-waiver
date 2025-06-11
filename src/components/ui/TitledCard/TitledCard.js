import { Box, Card, useTheme } from "@mui/material";
import React, { useMemo } from "react";
import Htag from "../../typography/Htag";
import TitledCardContent from "./TitledCardContent";
import { isNil } from "lodash";
import Flx from "../../layout/Flx";
import PropTypes from "prop-types";
import TitledGroup from "../TitledGroup";

/**
 * TitledCard component - A flexible card with customizable header and content
 *
 * @param {Object} props - Component props
 * @param {string} props.title - The card title
 * @param {React.ReactNode} props.children - Content to render in the card body
 * @param {boolean} props.fw - Whether the card should have full width
 * @param {Object} props.sx - Custom styles for the card
 * @param {Object} props.bodySx - Custom styles for the card body
 * @param {React.ReactNode} props.icon - Icon to display next to the title
 * @param {Object} props.headerSx - Custom styles for the header
 * @param {React.ReactNode} props.headerEndContent - Content to display at the end of the header (e.g., action buttons)
 * @param {React.ReactNode} props.headerContent - Additional content to display below the main header
 * @param {boolean} props.suppressPaddingTopBottom - Whether to remove top and bottom padding
 * @param {boolean} props.suppressPaddingLeftRight - Whether to remove left and right padding
 * @param {boolean} props.suppressPadding - Whether to remove all padding
 * @param {string} props.variant - Card variant ('outlined', 'elevation', etc.)
 * @param {boolean} props.suppressBorder - Whether to hide the border after the header
 * @param {boolean} props.h1 - Whether the title should be an h1
 * @param {boolean} props.h2 - Whether the title should be an h2
 * @param {boolean} props.h3 - Whether the title should be an h3
 * @param {boolean} props.h4 - Whether the title should be an h4
 * @param {boolean} props.h5 - Whether the title should be an h5
 * @param {string} props.titleColor - Custom color for the title (overrides the default)
 * @param {string} props.elevation - Card elevation level (1-24)
 */
const TitledCard = ({
  title,
  children,
  fw = false,
  cardSx = {},
  bodySx = {},
  innerSx = {},
  icon = null,
  headerSx = {},
  headerEndContent = null,

  suppressPadding,
  suppressHeaderPadding,
  suppressBodyPadding,
  uppercase,

  fontWeight,
  variant = "h2",
  grow = true,
}) => {
  // Calculate card root styles efficiently
  const cardRootStyles = useMemo(
    () => ({
      flexGrow: grow ? 1 : 0,
      p: 0,
      overflow: "hidden",
      // overflow: "unset",
      ...(fw && { width: "100%" }),
      ...(suppressPadding && { padding: 0 }),
      ...cardSx,
    }),
    [fw, suppressPadding, cardSx]
  );

  return (
    // <Card variant={variant} elevation={elevation} sx={cardRootStyles}>
    <Card sx={cardRootStyles}>
      <TitledGroup
        uppercase={uppercase}
        variant={variant}
        title={title}
        fontWeight={fontWeight}
        icon={icon}
        sx={innerSx}
        bodySx={bodySx}
        headerSx={headerSx}
        suppressBodyPadding={suppressBodyPadding}
        suppressPadding={suppressPadding}
        suppressHeaderPadding={suppressHeaderPadding}
        headerEndContent={headerEndContent}
      >
        {children}
      </TitledGroup>
    </Card>
  );
};

// PropTypes for better development experience
TitledCard.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node,
  fw: PropTypes.bool,
  sx: PropTypes.object,
  bodySx: PropTypes.object,
  icon: PropTypes.node,
  headerSx: PropTypes.object,
  headerEndContent: PropTypes.node,
  headerContent: PropTypes.node,
  suppressPaddingTopBottom: PropTypes.bool,
  suppressPaddingLeftRight: PropTypes.bool,
  suppressPadding: PropTypes.bool,
  variant: PropTypes.string,
  suppressBorder: PropTypes.bool,
  h1: PropTypes.bool,
  h2: PropTypes.bool,
  h3: PropTypes.bool,
  h4: PropTypes.bool,
  h5: PropTypes.bool,
  titleColor: PropTypes.string,
  elevation: PropTypes.number,
};

export default TitledCard;
