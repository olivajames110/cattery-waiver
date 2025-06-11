import { AddCircleOutline, LocationOnRounded } from "@mui/icons-material";
import { Autocomplete, Box, Grid, TextField, Typography } from "@mui/material";
import { debounce } from "lodash";
import React from "react";

const AddressSearchInput = ({ onSelect }) => {
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState(options_example);
  // const [options, setOptions] = React.useState([]);

  // const { loading, searchAddress } = useApiHook();

  const fetch = React.useMemo(
    () =>
      debounce((addressString, callback) => {
        console.log("addressString", addressString);
        // searchUnderwritingLoanPropertyAddress({
        //   addressString: addressString,
        //   onSuccessFn: callback,
        // });
      }, 400),
    []
  );

  React.useEffect(() => {
    let active = true;

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch(inputValue, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);
  return (
    <>
      <Autocomplete
        getOptionLabel={(option) => {
          return typeof option === "string" ? option : option.address?.fullAddress;
        }}
        slotProps={{
          popper: {
            sx: {
              zIndex: 11111,
            },
          },
        }}
        // Popp
        filterOptions={(x) => x}
        options={options}
        autoComplete
        fullWidth
        // loading={loading}
        includeInputInList
        // PopperComponent={}
        filterSelectedOptions
        value={value}
        noOptionsText="No locations"
        onChange={(event, newValue) => {
          let prop = { ...newValue };
          if (isNil(prop?.address?.longitude)) {
            prop.address.longitude = 100;
          }
          onSelect(prop);
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Search address" fullWidth variant="filled" size="small" />
        )}
        renderOption={(props, option) => {
          return (
            <li {...props} style={{ borderBottom: "1px solid #ebebeb", padding: "6px 0" }}>
              <Grid container alignItems="center">
                <Grid item sx={{ display: "flex", width: 44, justifyContent: "center" }}>
                  <LocationOnRounded sx={{ color: "#ff00008a" }} />
                  {/* <LocationOnRounded sx={{ color: "text.secondary" }} /> */}
                </Grid>
                <Grid item sx={{ width: "calc(100% - 88px)", wordWrap: "break-word" }}>
                  <Box component="span" sx={{ fontWeight: "bold", fontSize: ".75rem" }}>
                    {`${option.address?.fullAddress}`}
                  </Box>
                  <Typography variant="body2" sx={{ fontSize: ".7rem" }} color="text.secondary">
                    {`${option.address?.city}, ${option.address?.state}`}
                  </Typography>
                </Grid>
                <Grid item sx={{ display: "flex", width: 44, justifyContent: "center" }}>
                  <AddCircleOutline sx={{ color: "text.secondary" }} />
                </Grid>
              </Grid>
            </li>
          );
        }}
      />
    </>
  );
};

const options_example = [
  {
    address: {
      fullAddress: "125 Carley Drive, West Sayville, NY 11796",
      streetName: "Carley Drive",
      streetNumber: "125",
      zip: "11796",
      county: "Suffolk",
      state: "New York",
      city: "West Sayville",
      country: "United States",
      latitude: 10.55555,
      longitude: -14.55555,
      bounding_box: {
        top_left: {
          lat: 10.55555,
          lon: -14.55555,
        },
        bottom_right: {
          lat: 10.55555,
          lon: -14.55555,
        },
      },
    },
  },
];
const options_examplee = [
  {
    address: {
      fullAddress: "125 Carley Drive, West Sayville, NY 11796",
      streetName: "Carley Drive",
      streetNumber: "125",
      zip: "11796",
      county: "Suffolk",
      state: "New York",
      city: "West Sayville",
      country: "United States",
      latitude: 10.55555,
      longitude: -14.55555,
      bounding_box: {
        top_left: {
          lat: 10.55555,
          lon: -14.55555,
        },
        bottom_right: {
          lat: 10.55555,
          lon: -14.55555,
        },
      },
    },
  },
  {
    address: {
      fullAddress: "125 Carley Avenue, Huntington, NY 11743",
      streetName: "Carley Avenue",
      streetNumber: "125",
      zip: "11743",
      county: "Suffolk",
      state: "New York",
      city: "Huntington",
      country: "United States",
      latitude: 40.866112,
      longitude: -73.43475,
      bounding_box: {
        top_left: {
          lat: 40.86701,
          lon: -73.43594,
        },
        bottom_right: {
          lat: 40.86521,
          lon: -73.43356,
        },
      },
    },
  },
  {
    address: {
      fullAddress: "125 Carley Lane, Lexington, NC 27295",
      streetName: "Carley Lane",
      streetNumber: "125",
      zip: "27295",
      county: "Davidson",
      state: "North Carolina",
      city: "Lexington",
      country: "United States",
      latitude: 35.8771726,
      longitude: -80.2492676,
      bounding_box: {
        top_left: {
          lat: 35.87741,
          lon: -80.24931,
        },
        bottom_right: {
          lat: 35.87712,
          lon: -80.24919,
        },
      },
    },
  },
  {
    address: {
      fullAddress: "125 Carley Road, Springfield, VT 05156",
      streetName: "Carley Road",
      streetNumber: "125",
      zip: "05156",
      county: "Windsor",
      state: "Vermont",
      city: "Springfield",
      country: "United States",
      latitude: 43.3230398,
      longitude: -72.5026774,
      bounding_box: {
        top_left: {
          lat: 43.32307,
          lon: -72.50277,
        },
        bottom_right: {
          lat: 43.32297,
          lon: -72.50273,
        },
      },
    },
  },
  {
    address: {
      fullAddress: "125 Carley Lane, Bedford, KY 40006",
      streetName: "Carley Lane",
      streetNumber: "125",
      zip: "40006",
      county: "Trimble",
      state: "Kentucky",
      city: "Bedford",
      country: "United States",
      latitude: 38.6719305,
      longitude: -85.3089941,
      bounding_box: {
        top_left: {
          lat: 38.67218,
          lon: -85.30894,
        },
        bottom_right: {
          lat: 38.67191,
          lon: -85.3089,
        },
      },
    },
  },
  {
    address: {
      fullAddress: "125 Carley Court, Georgetown, KY 40324",
      streetName: "Carley Court",
      streetNumber: "125",
      zip: "40324",
      county: "Scott",
      state: "Kentucky",
      city: "Georgetown",
      country: "United States",
      latitude: 38.1992465,
      longitude: -84.5455829,
      bounding_box: {
        top_left: {
          lat: 38.19924,
          lon: -84.54569,
        },
        bottom_right: {
          lat: 38.19921,
          lon: -84.54561,
        },
      },
    },
  },
  {
    address: {
      fullAddress: "125 Carley Lane, Collinston, LA 71229",
      streetName: "Carley Lane",
      streetNumber: "125",
      zip: "71229",
      county: "Ouachita",
      state: "Louisiana",
      city: "Collinston",
      country: "United States",
      latitude: 32.6349797,
      longitude: -91.9329151,
      bounding_box: {
        top_left: {
          lat: 32.63531,
          lon: -91.93297,
        },
        bottom_right: {
          lat: 32.63497,
          lon: -91.93294,
        },
      },
    },
  },
  {
    address: {
      fullAddress: "125 Carley Drive, Coventry, RI 02816",
      streetName: "Carley Drive",
      streetNumber: "125",
      zip: "02816",
      county: "Kent",
      state: "Rhode Island",
      city: "Coventry",
      country: "United States",
      latitude: 41.6962283,
      longitude: -71.5545653,
      bounding_box: {
        top_left: {
          lat: 41.69697,
          lon: -71.55482,
        },
        bottom_right: {
          lat: 41.69613,
          lon: -71.5546,
        },
      },
    },
  },
  {
    address: {
      fullAddress: "125 Carley Street, Cleveland, MS 38732",
      streetName: "Carley Street",
      streetNumber: "125",
      zip: "38732",
      county: "Bolivar",
      state: "Mississippi",
      city: "Cleveland",
      country: "United States",
      latitude: 33.73415,
      longitude: -90.7534941,
      bounding_box: {
        top_left: {
          lat: 33.73411,
          lon: -90.75355,
        },
        bottom_right: {
          lat: 33.7341,
          lon: -90.753,
        },
      },
    },
  },
  {
    address: {
      fullAddress: "125 Carley Lane, Saint Maries, ID 83861",
      streetName: "Carley Lane",
      streetNumber: "125",
      zip: "83861",
      county: "Benewah",
      state: "Idaho",
      city: "Saint Maries",
      country: "United States",
      latitude: 47.3339983,
      longitude: -116.5557618,
      bounding_box: {
        top_left: {
          lat: 47.33409,
          lon: -116.55583,
        },
        bottom_right: {
          lat: 47.33399,
          lon: -116.55583,
        },
      },
    },
  },
];
export default AddressSearchInput;
