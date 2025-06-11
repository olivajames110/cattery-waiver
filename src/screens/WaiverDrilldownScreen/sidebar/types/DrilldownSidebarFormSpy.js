import { memo } from "react";
import { useSelector } from "react-redux";
import JsonPreview from "../../../../components/common/JsonPreview";
import DrilldownSidebarPane from "../DrilldownSidebarPane";

const DrilldownSidebarFormSpy = memo(() => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);

  return (
    <DrilldownSidebarPane title="Form Spy">
      <JsonPreview values={loanDrilldown} />
    </DrilldownSidebarPane>
  );
});

export default DrilldownSidebarFormSpy;
