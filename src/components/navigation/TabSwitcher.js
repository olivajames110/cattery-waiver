import { TabPanel } from "@mui/lab";
import { Tab, Tabs } from "@mui/material";
import { isString } from "lodash";
import React from "react";

const TabSwitcher = ({ value, onChange, tabs }) => {
  const handleChange = (event, newValue) => {
    onChange(newValue);
  };

  return (
    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
      {tabs?.map((tab) => {
        const tab_label = isString(tab) ? tab : tab?.label;
        const tab_value = isString(tab) ? tab : tab?.value;

        return <Tab label={tab_label} value={tab_value} />;
      })}
    </Tabs>
  );
};

export default TabSwitcher;
