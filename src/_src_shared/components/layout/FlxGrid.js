import { useMemo } from "react";
import Flx from "../../../components/layout/Flx";

const FlxGrid = ({ children, width = "300px", grow = 1, sx, gap = 1 }) => {
  const styles = useMemo(() => {
    return {
      display: "grid",
      gridTemplateColumns: `repeat(auto-fit, minmax(${width}, ${grow}fr))`,
      gap: gap,
      ...sx,
    };
  }, [sx, width, grow, gap]);
  return (
    <Flx wrap sx={styles}>
      {children}
    </Flx>
  );
};

export default FlxGrid;
