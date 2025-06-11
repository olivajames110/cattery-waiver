export const updateObjectInArray = (array, updatedObject, uniqueKey = "_id") => {
  return array.map((item) => (item[uniqueKey] === updatedObject[uniqueKey] ? updatedObject : item));
};
