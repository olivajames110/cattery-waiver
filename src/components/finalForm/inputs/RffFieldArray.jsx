import { Add, DeleteOutline, ExpandMoreRounded } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  Grid,
  IconButton,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { useMemo } from "react";
import { FieldArray } from "react-final-form-arrays";
import { useFormState } from "react-final-form";
import Flx from "../../layout/Flx";
import Htag from "../../typography/Htag";
import RffFieldComponentRenderer from "../shared/RffFieldComponentRenderer";
import rffEvaluateFieldCondition from "../utils/rffEvaluateFieldCondition";

const requiredValidator = (value) => (value ? undefined : "Required");

const RffFieldArray = ({ name, label, elements, required }) => {
  // const validate = useMemo(
  //   () =>
  //     required
  //       ? (value) => (value && value.length > 0 ? undefined : "Required")
  //       : undefined,
  //   [required]
  // );
  const validate = useMemo(
    () =>
      required
        ? (value) =>
            Array.isArray(value) && value.length > 0
              ? undefined
              : "At least one entry is required"
        : undefined,
    [required]
  );

  const { values } = useFormState();

  return (
    <Grid item xs={12}>
      <FieldArray name={name} validate={validate}>
        {({ fields: arrayFields, meta }) => {
          console.log("Array Validation:", name, "Error:", meta.error); // Debuggin
          return (
            <React.Fragment>
              {arrayFields.map((fieldName, index) => (
                <React.Fragment key={fieldName}>
                  <Accordion
                    defaultExpanded
                    sx={{
                      m: "0 !important",
                      borderRadius: "4px",
                      boxShadow: "0 0 0px 1px #dde0e4",
                      overflow: "hidden",
                      background: "#f2f5f7",
                    }}
                  >
                    <AccordionSummary
                      sx={{ borderBottom: "1px solid #dde0e4" }}
                      expandIcon={
                        <ExpandMoreRounded sx={{ color: "#232a31" }} />
                      }
                    >
                      <Flx fw jb ac sx={{ color: "#232a31" }}>
                        <Htag h3 sx={{ color: "inherit" }}>
                          {`${label} #${index + 1}`}
                        </Htag>
                        <IconButton
                          sx={{ color: "inherit" }}
                          onClick={() => arrayFields.remove(index)}
                          size="small"
                        >
                          <DeleteOutline fontSize="small" />
                        </IconButton>
                      </Flx>
                    </AccordionSummary>
                    <AccordionDetails sx={{ background: "#ffffff", pt: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        {elements.map((field) => {
                          const itemValues = values?.[name]?.[index] || {};

                          if (
                            !rffEvaluateFieldCondition(
                              field.condition,
                              itemValues
                            )
                          ) {
                            return null;
                          }

                          // Fix: Convert "borrowers[0]" to "borrowers.0"
                          const convertedFieldName = fieldName.replace(
                            /\[(\d+)\]/g,
                            ".$1"
                          );
                          const nestedFieldName = `${convertedFieldName}.${field.field}`;

                          return (
                            <RffFieldComponentRenderer
                              key={`${fieldName}.${field.field}`}
                              field={{
                                ...field,
                                field: nestedFieldName, // Now uses dot notation
                                validate: field.required
                                  ? requiredValidator
                                  : undefined,
                              }}
                            />
                          );
                        })}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                  {arrayFields.length > 1 &&
                    index + 1 !== arrayFields.length && (
                      <Divider
                        sx={{
                          mt: 3.5,
                          mb: 3.5,
                          borderStyle: "dashed",
                          opacity: 0.6,
                        }}
                      />
                    )}
                </React.Fragment>
              ))}

              <Flx
                center
                fw
                item
                sx={{
                  color: "#232a31",
                }}
              >
                <Button
                  variant="text"
                  size="medium"
                  color="inherit"
                  fullWidth
                  startIcon={<Add />}
                  onClick={() => {
                    if (!Array.isArray(elements)) {
                      console.error(
                        "elements is undefined or not an array",
                        elements
                      );
                      return;
                    }

                    // Initialize new item based on defined elements
                    const newItem = elements.reduce((acc, field) => {
                      acc[field.field] = "";
                      return acc;
                    }, {});

                    arrayFields.push(newItem);
                  }}
                >
                  Add {label}
                </Button>
                {meta.touched && typeof meta.error === "string" && (
                  <div style={{ color: "red", marginTop: "4px" }}>
                    {meta.error}
                  </div>
                )}
              </Flx>
            </React.Fragment>
          );
        }}
      </FieldArray>
    </Grid>
  );
};

export default RffFieldArray;
