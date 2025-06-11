import { useMemo, useState } from "react";
import _ from "lodash";
import JsonView from "react18-json-view";
import SearchInput from "../inputs/SearchInput";
import Flx from "../layout/Flx";
import ToggleTabSwitcher from "../navigation/ToggleTabSwitcher";

const sortObjectKeys = (obj) => {
  if (!_.isObject(obj) || _.isNull(obj)) {
    return obj;
  }

  if (_.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }

  const sortedKeys = Object.keys(obj).sort((a, b) => a.localeCompare(b));
  const sortedObj = {};

  for (const key of sortedKeys) {
    sortedObj[key] = sortObjectKeys(obj[key]);
  }

  return sortedObj;
};

const filterJson = (obj, search, shouldSort = true) => {
  if (!search) return shouldSort ? sortObjectKeys(obj) : obj;

  const lowerSearch = search.toLowerCase();

  const recursiveFilter = (data) => {
    if (_.isObject(data) && !_.isNull(data)) {
      if (_.isArray(data)) {
        const filteredArray = data
          .map(recursiveFilter)
          .filter((item) => !_.isUndefined(item));
        return filteredArray.length ? filteredArray : undefined;
      } else {
        const entries = Object.entries(data)
          .map(([key, value]) => {
            const filteredValue = recursiveFilter(value);
            const keyMatches = key.toLowerCase().includes(lowerSearch);
            const valueMatches =
              _.isString(value) && value.toLowerCase().includes(lowerSearch);
            if (keyMatches || valueMatches || !_.isUndefined(filteredValue)) {
              return [
                key,
                !_.isUndefined(filteredValue) ? filteredValue : value,
              ];
            }
            return null;
          })
          .filter(Boolean);

        if (entries.length) {
          if (shouldSort) {
            entries.sort(([a], [b]) => a.localeCompare(b));
          }
          return Object.fromEntries(entries);
        }
        return undefined;
      }
    } else if (_.isString(data) && data.toLowerCase().includes(lowerSearch)) {
      return data;
    }
    return undefined;
  };

  return recursiveFilter(obj);
};

const JsonPreview = ({ values, show = true, sortKeys = true }) => {
  const [search, setSearch] = useState("");
  const [collapse, setCollapse] = useState(1);
  const filteredValues = useMemo(
    () => filterJson(values, search, sortKeys),
    [values, search, sortKeys]
  );

  if (!show) return null;
  return (
    <Flx column gap={2} sx={{ ".json-view div": { margin: "3px 0" } }}>
      <Flx fw ac>
        <SearchInput value={search} onChange={setSearch} fullWidth />
        <ToggleTabSwitcher
          value={collapse}
          onChange={setCollapse}
          tabs={[1, 2, 3, 4]}
        />
      </Flx>
      <JsonView
        src={filteredValues}
        theme="atom"
        enableClipboard
        displaySize
        collapsed={collapse}
      />
    </Flx>
  );
};

export default JsonPreview;
