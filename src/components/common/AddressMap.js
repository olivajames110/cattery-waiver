import { isEmpty, isNil } from "lodash";
import { useMemo } from "react";
import AzureMap from "../AzureMap";
import Flx from "../layout/Flx";
import { MapOutlined } from "@mui/icons-material";
import Txt from "../typography/Txt";

const AddressMap = ({
  address,
  showAddress,
  showAddressDetails,
  height = "200px",
  minHeight,
  sx,
}) => {
  // console.log("address ------------------>>>>", address);

  const latitude = useMemo(() => address?.latitude, [address?.latitude]);
  const longitude = useMemo(() => address?.longitude, [address?.longitude]);
  // if (isEmpty(address)) {
  //   return null;
  // }

  if (isNil(latitude) || isNil(longitude)) {
    return (
      <Flx
        center
        sx={{
          height,
          // minHeight,
          // width,
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
  return <AzureMap height={height} latitude={latitude} longitude={longitude} />;
  // return (
  //   <Card variant="outlined" sx={styles}>
  //     {showAddress ? <Txt sx={{ p: 1 }}>{address?.fullAddress}</Txt> : null}
  //     <AzureMap
  //       height={height}
  //       latitude={address?.latitude}
  //       longitude={address?.longitude}
  //     />
  //   </Card>
  // );
};
export default AddressMap;
