import { columnTypesBoolean } from "./columnTypesBoolean";
import { columnTypesDate } from "./columnTypesDate";
import { columnTypesDollar } from "./columnTypesDollar";
import { columnTypesPercent } from "./columnTypesPercent";
import { columnTypesStringText } from "./columnTypesStringText";

export const columnTypesDefault = () => {
  return {
    ...columnTypesStringText(),
    ...columnTypesDate(),
    ...columnTypesPercent(),
    ...columnTypesDollar(),
    ...columnTypesBoolean(),
  };
};
