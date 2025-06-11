import React from "react";
import TabPanel from "../../../components/navigation/TabPanel";
import Htag from "../../../components/typography/Htag";
import Txt from "../../../components/typography/Txt";

const ComingSoonTab = ({ value, tab }) => {
  //   const files = useSelector((state) => state.files);

  return (
    <TabPanel value={value} tabValue={tab}>
      <Htag>{value}</Htag>
      <Txt>Coming Soon</Txt>
    </TabPanel>
  );
};

export default ComingSoonTab;
