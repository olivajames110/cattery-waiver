import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import Txt from "../typography/Txt";
import Flx from "../layout/Flx";

const AddressGeolocateInput = ({
  value,
  onChange,
  placeholder = "Enter an address (e.g., 123 Main St, Boston, MA)",
  error,
  helperText,
  sx,
  fullWidth = true,
  disabled = false,
  hideButtons,
  keepInputVisible = false, // New prop to control behavior
}) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const azureMapsKey = process.env.REACT_APP_AZURE_MAPS_KEY;

  // Initialize input value when value prop changes
  useEffect(() => {
    if (value?.fullAddress && !isEditing && !isFocused) {
      setInputValue(value.fullAddress);
    }
  }, [value, isEditing, isFocused]);

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

  const handleChange = (event, selectedOption) => {
    if (selectedOption) {
      onChange?.(selectedOption);
      setInputValue(selectedOption.fullAddress);
      setIsEditing(false);

      // Clear options and hide dropdown after selection
      setOptions([]);
      setShowNoResults(false);

      // If using keepInputVisible, set focused to false after a delay
      if (keepInputVisible) {
        setTimeout(() => {
          setIsFocused(false);
        }, 100);
      }
    }
  };

  const handleFocus = (event) => {
    setIsFocused(true);
    if (keepInputVisible && value?.fullAddress) {
      setInputValue(value.fullAddress);
    }
  };

  const handleBlur = (event) => {
    // Add a small delay to prevent conflicts with selection
    setTimeout(() => {
      setIsFocused(false);
      if (keepInputVisible && value?.fullAddress) {
        setInputValue(value.fullAddress);
      }
    }, 150);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setInputValue(value?.fullAddress || "");
    onChange?.(null);
  };

  const handleDelete = () => {
    onChange?.(null);
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

  const renderSelectedAddress = (selectedAddress) => (
    <Box
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      <Flx
        gap={0.5}
        ac
        fw
        jb
        sx={{
          minHeight: 44,
        }}
      >
        <Flx ac gap={1} sx={{ flex: 1 }}>
          <HomeRounded sx={{ color: grey[500] }} />
          <Box>
            <Txt bold sx={{ lineHeight: 1.2, color: grey[800] }}>
              {selectedAddress.fullAddress}
            </Txt>
          </Box>
        </Flx>
        {hideButtons ? null : (
          <Flx gap={0.5} ac>
            <IconButton
              size="small"
              color="primary"
              onClick={handleEdit}
              disabled={disabled}
            >
              <EditOutlined />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={handleDelete}
              disabled={disabled}
            >
              <DeleteOutlined />
            </IconButton>
          </Flx>
        )}
      </Flx>
      {error && helperText && (
        <Typography variant="caption" color="error" sx={{ px: 1.4, pb: 1 }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );

  const renderAutocomplete = () => (
    <Autocomplete
      freeSolo
      options={options}
      loading={loading}
      disabled={disabled}
      open={
        inputValue.length >= 3 &&
        (options.length > 0 || showNoResults) &&
        (!keepInputVisible || isFocused)
      }
      getOptionLabel={(option) => option.fullAddress || ""}
      getOptionKey={(option) => option.id}
      inputValue={inputValue}
      sx={{ flexGrow: 1 }}
      onInputChange={handleInputChange}
      onChange={handleChange}
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
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          fullWidth={fullWidth}
          onFocus={handleFocus}
          onBlur={handleBlur}
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

  const hasValue = Boolean(value?.fullAddress);
  const shouldShowSelected = hasValue && !isEditing && !keepInputVisible;
  const shouldShowInput = !hasValue || isEditing || keepInputVisible;

  return shouldShowSelected
    ? renderSelectedAddress(value)
    : renderAutocomplete();
};

export default AddressGeolocateInput;
