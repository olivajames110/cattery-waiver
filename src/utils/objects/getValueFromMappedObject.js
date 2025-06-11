import { isNil } from "lodash";

export const getValueFromMappedObject = (objectMap, mapKey, defaultValueString) => {
  const objectMapKeys = Object.keys(objectMap);
  let domainMapKeyDefault = defaultValueString ? defaultValueString : objectMapKeys[0];

  let domainMapKey = isNil(mapKey) ? domainMapKeyDefault : mapKey;

  return objectMap[domainMapKey];
};
