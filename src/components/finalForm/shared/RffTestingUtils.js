import { Button, Checkbox, FormControlLabel } from "@mui/material";
import React, { useCallback, useMemo } from "react";
import Txt from "../../typography/Txt";
import { orange } from "@mui/material/colors";
import Flx from "../../layout/Flx";

const RffTestingUtils = ({ testing, setTesting }) => {
  const queryParams = new URLSearchParams(window.location.search);
  const isTesting = queryParams.get("testing") === "true";

  const _enabled = useMemo(() => testing?.enabled, [testing?.enabled]);
  const _required = useMemo(() => testing?.required, [testing?.required]);
  const _showHidden = useMemo(() => testing?.showHidden, [testing?.showHidden]);
  const _formSpy = useMemo(() => testing?.formSpy, [testing?.formSpy]);

  /** Properly update state without mutating it */
  const onChange = useCallback(
    (name, val) => {
      setTesting((prev) => ({ ...prev, [name]: val }));
    },
    [setTesting]
  );

  if (!isTesting || !_enabled) return null;

  return (
    <Flx
      column
      sx={{
        bottom: 10,
        left: 15,
        position: "fixed",
        zIndex: 11,
        background: orange[100],
        p: 1,
        fontSize: "12px",
        "label span": {
          fontSize: "12px",
        },
      }}
    >
      <Txt sx={{ fontSize: "inherit" }} bold>
        Form Testing
      </Txt>

      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={_required}
            onChange={(e) => onChange("required", e.target.checked)}
          />
        }
        label="Enable Required Fields"
      />
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={_showHidden}
            onChange={(e) => onChange("showHidden", e.target.checked)}
          />
        }
        label="Show Hidden Fields"
      />
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={_formSpy}
            onChange={(e) => onChange("formSpy", e.target.checked)}
          />
        }
        label="Form Spy"
      />

      <Button
        variant="outlined"
        color="inherit"
        sx={{ mt: 2 }}
        onClick={() => onChange("enabled", false)}
      >
        Click to hide
      </Button>
    </Flx>
  );
};
export default RffTestingUtils;
