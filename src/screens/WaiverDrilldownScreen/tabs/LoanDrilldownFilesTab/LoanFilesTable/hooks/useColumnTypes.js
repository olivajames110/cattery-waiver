import { useMemo } from "react";
import { columnTypesDate } from "../../../../../../_src_shared/utils/agGrid/columnTypes/columnTypesDate";
import { columnTypesNumber } from "../../../../../../_src_shared/utils/agGrid/columnTypes/columnTypesNumber";

export function useColumnTypes() {
  return useMemo(() => {
    return {
      ...columnTypesDate(),
      ...columnTypesNumber(),
    };
  }, []);
}
