import ScreenContent from "../../../components/layout/ScreenContent";
import TitledHeaderWithSearch from "../../../components/layout/TitledHeaderWithSearch";

const TableClickthroughSection = ({
  title,
  children,
  bottomContent,
  quickFilter,
  setQuickFilter,
  endContent,
  searchPlaceholder,
  sx,
}) => {
  return (
    <>
      <TitledHeaderWithSearch
        title={title}
        quickFilter={quickFilter}
        setQuickFilter={setQuickFilter}
        endContent={endContent}
      />
      <ScreenContent
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 0,
          ...sx,
        }}
      >
        {children}
      </ScreenContent>
    </>
  );
};

export default TableClickthroughSection;
