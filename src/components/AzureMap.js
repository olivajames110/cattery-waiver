import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { MapOutlined } from "@mui/icons-material";
import * as atlas from "azure-maps-control";

import Txt from "./typography/Txt";
import { isNil } from "lodash";
import Flx from "./layout/Flx";

const AzureMap = ({
  height = "320px",
  minHeight,
  latitude,
  longitude,
  width = "100%",
  sx,
  address,
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const dataSourceRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const azureMapsKey = process.env.REACT_APP_AZURE_MAPS_KEY;

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !azureMapsKey) return;

    // Create map instance without any resize-related features
    const map = new atlas.Map(mapRef.current, {
      authOptions: {
        authType: "subscriptionKey",
        subscriptionKey: azureMapsKey,
      },
      center: [longitude, latitude],
      zoom: 12,
      language: "en-US",
      view: "Auto",
    });

    // Wait for map to be ready
    map.events.add("ready", () => {
      // Create a data source
      const dataSource = new atlas.source.DataSource();
      map.sources.add(dataSource);

      // Create a marker
      const marker = new atlas.data.Feature(
        new atlas.data.Point([longitude, latitude]),
        {
          title: address || "Location",
        }
      );
      dataSource.add(marker);

      // Create a symbol layer
      map.layers.add(
        new atlas.layer.SymbolLayer(dataSource, null, {
          iconOptions: {
            image: "pin-round-blue",
            size: 1,
            anchor: "bottom",
          },
          textOptions: {
            textField: ["get", "title"],
            offset: [0, -2],
          },
        })
      );

      // Store references
      mapInstanceRef.current = map;
      dataSourceRef.current = dataSource;
      setIsMapReady(true);
    });

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.dispose();
        mapInstanceRef.current = null;
        dataSourceRef.current = null;
        setIsMapReady(false);
      }
    };
  }, [azureMapsKey]); // Only re-initialize if API key changes

  // Update map when coordinates change
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !dataSourceRef.current)
      return;
    if (isNil(latitude) || isNil(longitude)) return;

    // Update map center
    mapInstanceRef.current.setCamera({
      center: [longitude, latitude],
      zoom: 12,
    });

    // Clear existing markers
    dataSourceRef.current.clear();

    // Add new marker
    const marker = new atlas.data.Feature(
      new atlas.data.Point([longitude, latitude]),
      {
        title: address || "Location",
      }
    );
    dataSourceRef.current.add(marker);
  }, [latitude, longitude, address, isMapReady]);

  // Show placeholder if no coordinates
  if (isNil(latitude) || isNil(longitude)) {
    return (
      <Flx
        center
        sx={{
          height,
          minHeight,
          width,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f5f5",
          gap: 1,
          ...sx,
        }}
      >
        <MapOutlined sx={{ color: "#666", fontSize: "2rem" }} />
        <Txt sx={{ color: "#666" }}>No location available</Txt>
      </Flx>
    );
  }

  return (
    <Box
      ref={mapRef}
      sx={{
        height,
        minHeight,
        width,
        ...sx,
      }}
    />
  );
};

export default AzureMap;
