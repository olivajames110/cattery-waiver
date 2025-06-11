import React from "react";
import Flx from "../../layout/Flx";
import Htag from "../../typography/Htag";
import Txt from "../../typography/Txt";
import { Divider } from "@mui/material";
const sizeOffset = {
  sm: 4,
  md: 10,
  lg: 16,
  // lg: 20,
};
// Title + Description at the top of the form
const FormTitleAndDescription = ({
  title,
  description,
  size,
  titleContent,
  titleEndContent,
}) => {
  if (!title && !description) return null;

  return (
    <>
      <Flx fw column>
        {titleContent || titleEndContent ? (
          <Flx fw ac>
            <TitleDescription
              title={title}
              description={description}
              size={size}
              titleContent={titleContent}
            />
            {titleEndContent}
          </Flx>
        ) : (
          <TitleDescription
            title={title}
            description={description}
            size={size}
            titleContent={titleContent}
          />
        )}
        {titleContent}
      </Flx>
      {/* <Divider
        sx={{
          //   mb: 6,
          mt: sizeOffset[size] / 2,
          mb: sizeOffset[size] / 2,
          //
        }}
      /> */}
    </>
  );
};

const TitleDescription = ({ title, description, titleContent, size }) => {
  return (
    <Flx
      flexGrow
      column
      //   gap={1}
      sx={{
        flexGrow: 1,
        // mb: sizeOffset[size] / 2,
      }}
    >
      {title && (
        <Htag
          h1
          sx={{
            fontFamily: "var(--inter)",
            fontSize: "36px",
            lineHeight: "54px",
            color: "#232a31",
          }}
        >
          {title}
        </Htag>
      )}
      {description && (
        <Txt sx={{ color: "#232a31" }} fontSize="18px">
          {description}
        </Txt>
      )}
    </Flx>
  );
};
export default FormTitleAndDescription;
