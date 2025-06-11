import React, { useMemo, useRef } from "react";
import { Field } from "react-final-form";
import SignatureCanvas from "react-signature-canvas";

import RffInputWrapper from "../shared/RffInputWrapper";
import { VALIDATOR_REQUIRE } from "../../../utils/finalForm/validators/VALIDATOR_REQUIRE";
import { Box, Button, FormHelperText } from "@mui/material";
import { grey } from "@mui/material/colors";
import Flx from "../../layout/Flx";

const RffSignatureField = ({
  name,
  label,
  required,
  suppressGrid,
  size,
  sx,

  // Optionally pass props for customizing the signature canvas
  canvasProps = { width: "100%", height: "140px", className: "sigCanvas" },
}) => {
  const signatureRef = useRef(null);

  // If required, use the existing validator
  const validate = useMemo(
    () => (required ? VALIDATOR_REQUIRE : undefined),
    [required]
  );

  return (
    <RffInputWrapper
      label={label}
      suppressGrid={suppressGrid}
      size={size}
      required={required}
    >
      <Field
        name={name}
        validate={validate}
        subscription={{ value: true, error: true, touched: true }}
        render={({ input, meta }) => {
          // Normal function defined in the render scope (no Hooks).
          function handleEnd() {
            if (!signatureRef.current) return;

            try {
              // Try "trimmed" version
              const trimmedCanvas = signatureRef.current.getTrimmedCanvas();
              input.onChange(trimmedCanvas.toDataURL("image/png"));
            } catch (error) {
              // Fallback to getCanvas if getTrimmedCanvas() isn't supported
              const rawCanvas = signatureRef.current.getCanvas();
              input.onChange(rawCanvas.toDataURL("image/png"));
            }
          }

          function clearSignature() {
            if (!signatureRef.current) return;
            signatureRef.current.clear();
            input.onChange(null); // Clear form value
          }

          return (
            <Flx column>
              <Box
                sx={{
                  border: `1px solid ${grey[300]}`,
                  borderRadius: "4px",
                  canvas: {
                    width: "100%",
                    height: canvasProps.height,
                  },
                }}
              >
                {/* Signature pad area */}
                <SignatureCanvas
                  ref={signatureRef}
                  penColor="black"
                  onEnd={handleEnd}
                  {...canvasProps}
                  style={sx}
                />

                {/* Clear button */}

                {/* Display the saved signature from form state (if any) */}
                {/* {input.value && <SignaturePreview src={input.value} />} */}
              </Box>
              <Flx column>
                {input.value ? (
                  <Button variant="text" onClick={clearSignature}>
                    Clear Signature
                  </Button>
                ) : null}
              </Flx>

              {/* Final Form error handling */}
              {meta.touched && meta.error && (
                <FormHelperText sx={{ ml: 3 }} error>
                  {meta.error}
                </FormHelperText>
              )}
            </Flx>
          );
        }}
      />
    </RffInputWrapper>
  );
};

const SignaturePreview = ({ src }) => {
  return (
    <div style={{ marginTop: "1rem" }}>
      <p>Saved Signature Preview:</p>
      <img
        src={src}
        alt="signature"
        style={{ border: "1px solid #ccc", maxWidth: "100%" }}
      />
    </div>
  );
};

export default RffSignatureField;
