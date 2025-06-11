import React, { useCallback, useEffect, useMemo, useState } from "react";
import AddressGeolocateInput from "../inputs/AddressGeolocateInput";
import Flx from "../layout/Flx";
import { Button, Card } from "@mui/material";
import Txt from "../typography/Txt";
import { EditOutlined } from "@mui/icons-material";
import AddressMap from "./AddressMap";
import { isNil } from "lodash";
import { loanDrilldownSet } from "../../redux/actions/loanDrilldownActions";
import { useDispatch, useSelector } from "react-redux";
import { useAddressHook } from "../../hooks/useAddressHook";

const LoanDrilldownAddressSection = ({
  property,
  borrower,
  name = "address",
  mapHeight = "220px",
}) => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const {
    loading,
    updateSubjectPropertyAddress,
    updateBorrowerAddress,
    createBorrowerAddressFromObject,
    createSubjectPropertyFromObject,
  } = useAddressHook();
  const [editing, setEditing] = useState(false);
  const [newAddress, setNewAddress] = useState(null);

  const targetObjectWithAddress = useMemo(() => {
    if (borrower) return { ...borrower };
    if (property) return { ...property };
  }, [borrower, property]);

  // console.log("targetObjectWithAddress", { targetObjectWithAddress });
  const dispatch = useDispatch();
  // Initialize mapAddress with property address on mount and when property changes
  useEffect(() => {
    if (targetObjectWithAddress?.[name]) {
      setNewAddress(null);
    }
  }, [targetObjectWithAddress?.[name]]);

  const displayedFullAddress = useMemo(() => {
    return (
      targetObjectWithAddress?.[name]?.fullAddress || "No address available"
    );
  }, [targetObjectWithAddress?.[name]]);

  const currentAddress = useMemo(() => {
    return targetObjectWithAddress?.[name];
  }, [targetObjectWithAddress?.[name]]);

  const onRequestSuccess = useCallback(
    (res) => {
      dispatch(loanDrilldownSet(res));
      setEditing(false);
      setNewAddress(null);
    },
    [loanDrilldownSet, dispatch]
  );

  const handleUpdateAddress = async () => {
    if (!newAddress) {
      console.error("No new address to update");
      return;
    }

    // onRequestSuccess({});
    // return;
    if (borrower) {
      if (isNil(currentAddress)) {
        // console.log("Creating");
        // return;
        createBorrowerAddressFromObject({
          dealId: loanDrilldown?._id,
          borrowerId: borrower?._id,
          addressObject: newAddress,
          onSuccessFn: (d) => {
            onRequestSuccess(d);
          },
        });
        return;
      }
      // console.log("Updating");
      // return;
      updateBorrowerAddress({
        dealId: loanDrilldown?._id,
        borrowerId: borrower?._id,
        addressObject: newAddress,
        onSuccessFn: (d) => {
          onRequestSuccess(d);
        },
      });
    }

    if (property) {
      if (isNil(currentAddress)) {
        createSubjectPropertyFromObject({
          dealId: loanDrilldown?._id,
          subjectPropertyId: property?._id,
          addressObject: newAddress,
          onSuccessFn: (d) => {
            onRequestSuccess(d);
          },
        });
        return;
      }
      updateSubjectPropertyAddress({
        dealId: loanDrilldown?._id,
        subjectPropertyId: property?._id,
        addressObject: newAddress,
        onSuccessFn: (d) => {
          onRequestSuccess(d);
        },
      });
    }
  };

  const onEditCancel = () => {
    setEditing(false);
    setNewAddress(null);
    // Reset map to original address
  };

  const onNewAddressSelect = (adr) => {
    setNewAddress(adr);
  };

  const handleEditClick = () => {
    setEditing(true);
    // Initialize newAddress with current address when editing starts
    if (targetObjectWithAddress?.[name]) {
      setNewAddress(targetObjectWithAddress?.[name]);
    }
  };

  return (
    <Flx column sx={{ width: "100%" }}>
      <Flx
        fw
        jb
        ac
        gap={4}
        sx={{
          px: 0.2,
          py: 0.5,
        }}
      >
        {editing ? (
          <>
            <AddressGeolocateInput
              value={newAddress}
              onChange={onNewAddressSelect}
              sx={{ width: "100%" }}
              hideButtons
              keepInputVisible
              placeholder="Enter your address"
              fullWidth
            />
            <Flx end sx={{ p: 1, gap: 1 }}>
              <Button
                variant="outlined"
                onClick={onEditCancel}
                color="error"
                size="small"
              >
                Cancel
              </Button>
              <Button
                loading={loading}
                onClick={handleUpdateAddress}
                size="small"
                variant="contained"
                disabled={
                  !newAddress || newAddress === targetObjectWithAddress?.[name]
                }
              >
                Save Address
              </Button>
            </Flx>
          </>
        ) : (
          <>
            <Txt sx={{ fontWeight: 600 }}>{displayedFullAddress}</Txt>
            <Button
              variant="text"
              startIcon={
                <EditOutlined sx={{ fontSize: "15px" }} className="thin" />
              }
              onClick={handleEditClick}
              size="small"
            >
              Edit
            </Button>
          </>
        )}
      </Flx>
      <Card sx={{ width: "100%", p: 0 }}>
        {editing && !isNil(newAddress) ? (
          <AddressMap address={newAddress} height={mapHeight} />
        ) : (
          <AddressMap address={currentAddress} height={mapHeight} />
        )}
      </Card>
    </Flx>
  );
};

export default LoanDrilldownAddressSection;
