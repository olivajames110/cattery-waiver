import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Field } from "react-final-form";
import {
  Autocomplete,
  TextField,
  Box,
  IconButton,
  CircularProgress,
  Paper,
  Typography,
  InputAdornment,
} from "@mui/material";
import {
  HomeRounded,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  LocationOffOutlined,
} from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { debounce } from "lodash";
import { VALIDATOR_REQUIRE } from "../../../utils/finalForm/validators/VALIDATOR_REQUIRE";
import RffInputWrapper from "../shared/RffInputWrapper";
import Flx from "../../layout/Flx";
import Txt from "../../typography/Txt";

const RffAddressGeolocateField = ({
  name,
  label,
  required,
  suppressGrid,
  onChange,
  size,
  sx,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const azureMapsKey = process.env.REACT_APP_AZURE_MAPS_KEY;

  const validate = useMemo(
    () => (required ? VALIDATOR_REQUIRE : undefined),
    [required]
  );

  const searchAddresses = useCallback(
    async (query) => {
      if (!query || query.length < 3) {
        setOptions([]);
        setShowNoResults(false);
        return;
      }

      setLoading(true);
      setShowNoResults(false);

      try {
        // Try address search first - limited to US only
        const searchUrl = `https://atlas.microsoft.com/search/address/json?api-version=1.0&subscription-key=${azureMapsKey}&query=${encodeURIComponent(query)}&typeahead=true&limit=10&countrySet=US`;

        const response = await fetch(searchUrl);
        const data = await response.json();

        let addresses = [];

        if (data.results && data.results.length > 0) {
          addresses = data.results
            .filter((result) => result.address?.countryCode === "US")
            .map((result) => ({
              id: `${result.id}-${Date.now()}`,
              fullAddress: result.address?.freeformAddress || "",
              streetNumber: result.address?.streetNumber || "",
              streetName: result.address?.streetName || "",
              zip: result.address?.postalCode || "",
              county: result.address?.countrySubdivision || "",
              state: result.address?.countrySubdivisionName || "",
              city: result.address?.municipality || "",
              country: result.address?.country || "",
              countryCode: result.address?.countryCode || "",
              latitude: result.position?.lat || 0,
              longitude: result.position?.lon || 0,
              coordinateTuple: [
                result.position?.lat || 0,
                result.position?.lon || 0,
              ],
              score: result.score || 0,
            }));
        }

        // If no results, try fuzzy search - also limited to US
        if (addresses.length === 0) {
          const fuzzyUrl = `https://atlas.microsoft.com/search/fuzzy/json?api-version=1.0&subscription-key=${azureMapsKey}&query=${encodeURIComponent(query)}&limit=10&countrySet=US`;

          const fuzzyResponse = await fetch(fuzzyUrl);
          const fuzzyData = await fuzzyResponse.json();

          if (fuzzyData.results && fuzzyData.results.length > 0) {
            addresses = fuzzyData.results
              .filter(
                (result) =>
                  result.address?.freeformAddress &&
                  result.address?.countryCode === "US"
              )
              .map((result) => ({
                id: `${result.id}-${Date.now()}`,
                fullAddress: result.address?.freeformAddress || "",
                streetNumber: result.address?.streetNumber || "",
                streetName: result.address?.streetName || "",
                zip: result.address?.postalCode || "",
                county: result.address?.countrySubdivision || "",
                state: result.address?.countrySubdivisionName || "",
                city: result.address?.municipality || "",
                country: result.address?.country || "",
                countryCode: result.address?.countryCode || "",
                latitude: result.position?.lat || 0,
                longitude: result.position?.lon || 0,
                coordinateTuple: [
                  result.position?.lat || 0,
                  result.position?.lon || 0,
                ],
                score: result.score || 0,
              }));
          }
        }

        setOptions(addresses);
        setShowNoResults(addresses.length === 0 && query.length >= 3);
      } catch (err) {
        console.error("Address search error:", err);
        setOptions([]);
        setShowNoResults(true);
      } finally {
        setLoading(false);
      }
    },
    [azureMapsKey]
  );

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce(searchAddresses, 500),
    [searchAddresses]
  );

  useEffect(() => {
    if (inputValue) {
      debouncedSearch(inputValue);
    } else {
      setOptions([]);
      setShowNoResults(false);
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [inputValue, debouncedSearch]);

  const handleInputChange = (event, newInputValue, reason) => {
    if (reason === "input" || reason === "clear" || reason === "reset") {
      setInputValue(newInputValue);

      // Handle paste event - immediately search
      if (event?.nativeEvent?.inputType === "insertFromPaste") {
        searchAddresses(newInputValue);
      }
    }
  };

  const handleChange = (input) => (event, selectedOption) => {
    if (selectedOption) {
      input.onChange(selectedOption);
      setInputValue(selectedOption.fullAddress);
      setIsEditing(false);
      if (onChange) {
        onChange(selectedOption);
      }
    }
  };

  const handleEdit = (input) => () => {
    setIsEditing(true);
    setInputValue(input.value?.fullAddress || "");
    input.onChange(null);
  };

  const handleDelete = (input) => () => {
    input.onChange(null);
    setInputValue("");
    setOptions([]);
    setShowNoResults(false);
    setIsEditing(false);
  };

  const renderNoResults = () => (
    <Paper elevation={0} sx={{ p: 2, textAlign: "center" }}>
      <LocationOffOutlined sx={{ fontSize: 40, color: grey[400], mb: 1 }} />
      <Typography variant="body2" color="text.secondary">
        No US addresses found for "{inputValue}"
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Try adding more details like city or state
      </Typography>
    </Paper>
  );

  const renderSelectedAddress = (selectedAddress, input) => (
    <Box
      sx={{
        border: `1px solid ${grey[300]}`,
        borderRadius: 2,
        overflow: "hidden",
        backgroundColor: grey[50],
      }}
    >
      <Flx gap={0.5} ac fw jb sx={{ p: 1, px: 1.4, minHeight: 44 }}>
        <Flx ac gap={1} sx={{ flex: 1 }}>
          <HomeRounded sx={{ color: grey[500] }} />
          <Box>
            <Txt bold sx={{ lineHeight: 1.2, color: grey[800] }}>
              {selectedAddress.fullAddress}
            </Txt>
            {/* {selectedAddress.city && selectedAddress.state && (
              <Typography variant="caption" color="text.secondary">
                {selectedAddress.city}, {selectedAddress.state}{" "}
                {selectedAddress.zip}
              </Typography>
            )} */}
          </Box>
        </Flx>
        <Flx gap={0.5}>
          <IconButton
            onClick={handleEdit(input)}
            size="small"
            color="primary"
            title="Edit address"
          >
            <EditOutlined />
          </IconButton>
          <IconButton
            onClick={handleDelete(input)}
            size="small"
            color="error"
            title="Remove address"
          >
            <DeleteOutlined />
          </IconButton>
        </Flx>
      </Flx>
    </Box>
  );

  const renderAutocomplete = (input, meta) => (
    <Autocomplete
      freeSolo
      options={options}
      loading={loading}
      open={inputValue.length >= 3 && (options.length > 0 || showNoResults)}
      getOptionLabel={(option) => option.fullAddress || ""}
      getOptionKey={(option) => option.id}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleChange(input)}
      noOptionsText={null}
      loadingText="Searching addresses..."
      filterOptions={(x) => x}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <Box>
            <Typography variant="body2">{option.fullAddress}</Typography>
            {option.city && option.state && (
              <Typography variant="caption" color="text.secondary">
                {option.city}, {option.state} {option.zip}
              </Typography>
            )}
          </Box>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Enter an address (e.g., 123 Main St, Boston, MA)"
          error={Boolean(meta.touched && meta.error)}
          helperText={meta.touched && meta.error}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined sx={{ color: grey[400] }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          sx={{ width: "100%", ...sx }}
        />
      )}
      PaperComponent={({ children, ...props }) => (
        <Paper {...props}>
          {children}
          {showNoResults && !loading && renderNoResults()}
        </Paper>
      )}
    />
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
          const hasValue = Boolean(input.value?.fullAddress);

          return hasValue && !isEditing
            ? renderSelectedAddress(input.value, input)
            : renderAutocomplete(input, meta);
        }}
      />
    </RffInputWrapper>
  );
};

// import React, { useMemo } from "react";
// import { Field } from "react-final-form";
// import { VALIDATOR_REQUIRE } from "../../../utils/finalForm/validators/VALIDATOR_REQUIRE";
// import RffInputWrapper from "../shared/RffInputWrapper";
// import AddressGeolocateInput from "../../inputs/AddressGeolocateInput";

// const RffAddressGeolocateField = ({
//   name,
//   label,
//   required,
//   suppressGrid,
//   onChange,
//   size,
//   sx,
//   placeholder,
// }) => {
//   const validate = useMemo(
//     () => (required ? VALIDATOR_REQUIRE : undefined),
//     [required]
//   );

//   return (
//     <RffInputWrapper
//       label={label}
//       suppressGrid={suppressGrid}
//       size={size}
//       required={required}
//     >
//       <Field
//         name={name}
//         validate={validate}
//         render={({ input, meta }) => (
//           <AddressGeolocateInput
//             value={input?.value}
//             onChange={(v) => {
//               input.onChange(v);
//               if (onChange) {
//                 onChange(v);
//               }
//             }}
//             error={meta.touched && !!meta.error}
//             helperText={meta.touched && meta.error}
//             placeholder={placeholder}
//             sx={sx}
//           />
//         )}
//       />
//     </RffInputWrapper>
//   );
// };

// export default RffAddressGeolocateField;
export default RffAddressGeolocateField;
