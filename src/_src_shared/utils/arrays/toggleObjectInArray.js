/**
 * Toggles an object in an array based on a specified key.
 * If an object with the same key value exists, it will be removed.
 * If no matching object exists, the new object will be added.
 *
 * @param {Array} array - The array to modify
 * @param {Object} object - The object to toggle
 * @param {string} keyName - The name of the key to compare
 * @return {Array} A new array with the object toggled
 */
export function toggleObjectInArray(array, object, keyName) {
  // Make sure we have a valid array
  if (!Array.isArray(array)) {
    return [object];
  }

  // Check if the object exists in the array by the key
  const existingIndex = array.findIndex(
    (item) => item && object && item[keyName] === object[keyName]
  );

  // If the object exists, remove it
  if (existingIndex !== -1) {
    return [
      ...array.slice(0, existingIndex),
      ...array.slice(existingIndex + 1),
    ];
  }

  // If the object doesn't exist, add it
  return [...array, object];
}
