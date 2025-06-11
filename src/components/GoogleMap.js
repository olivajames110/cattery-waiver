import { FmdGoodRounded, MapOutlined } from "@mui/icons-material";
import { Box } from "@mui/material";
import GoogleMapReact from "google-map-react";
import { isNil } from "lodash";
import React, { useEffect, useState } from "react";

import Txt from "./typography/Txt";
import Flx from "./layout/Flx";

const GoogleMap = ({ height, minHeight, latitude, longitude, width, sx }) => {
  // const [coords, setCoords] = useState(null);
  const [defaultProps, setDefaultProps] = useState(null);

  // useEffect(() => {
  //   if (coords) {
  //     setCoords(null);
  //   }
  // }, [latitude, longitude]);

  useEffect(() => {
    const defaultPropsInit = {
      center: {
        lat: latitude,
        lng: longitude,
      },
      zoom: 11,
    };
    setDefaultProps(defaultPropsInit);

    if (defaultProps) {
      setDefaultProps(null);
    }
  }, [latitude, longitude]);

  if (isNil(latitude) || isNil(longitude)) {
    return (
      <Box
        sx={{
          height: height ? height : "320px",
          minHeight: minHeight,
          width: width ? width : "100%",
          borderRadius: "8px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#e4e4e4",
          gap: "5px",
          ...sx,
        }}
      >
        <MapOutlined
          sx={{ color: "#b9b9b9", fontSize: "2rem", opacity: 0.8 }}
        />
        <Txt sx={{ color: "#a09f9f" }}>Map Not Found</Txt>
      </Box>
    );
  }

  if (isNil(defaultProps)) {
    return (
      <LoadingContent
        latitude={latitude}
        longitude={longitude}
        setDefaultProps={setDefaultProps}
      />
    );
  }

  return (
    <MapContent
      defaultProps={defaultProps}
      height={height}
      minHeight={minHeight}
      width={width}
      sx={sx}
    />
  );
};

const LoadingContent = ({ latitude, longitude, setDefaultProps }) => {
  useEffect(() => {
    const defaultPropsInit = {
      center: {
        lat: latitude,
        lng: longitude,
      },
      zoom: 11,
    };
    setDefaultProps(defaultPropsInit);
  }, [latitude, longitude]);
  return <>Loading</>;
};

const MapContent = ({ height, minHeight, sx, width, defaultProps }) => {
  const whiteMapStyle = [
    {
      elementType: "geometry",
      stylers: [{ color: "#eceeed" }],
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#000000" }],
    },
    // {
    //   elementType: "labels.text.stroke",
    //   stylers: [{ color: "#ffffff" }],
    // },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#cad2d3" }],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "#eceeed" }],
    },
  ];
  if (isNil(defaultProps)) {
    return null;
  }
  return (
    <Box
      style={{
        height: height ? height : "320px",
        minHeight: minHeight,
        width: width ? width : "100%",
        borderRadius: "8px",
        overflow: "hidden",
        ...sx,
      }}
    >
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_PLACES_API_KEY }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        // options={{ styles: whiteMapStyle }}
        tilt
      >
        {/* <AnyReactComponent lat={defaultProps.center?.lat} lng={defaultProps.center?.lng} text="My Marker" /> */}
        <Flx lat={defaultProps?.center?.lat} lng={defaultProps?.center?.lng}>
          <FmdGoodRounded
            sx={{
              color: "#ea4335",
              fontSize: "1.4rem",
              // stroke: "#b31412",
              //
            }}
          />
        </Flx>
      </GoogleMapReact>
    </Box>
  );
};

export default GoogleMap;
