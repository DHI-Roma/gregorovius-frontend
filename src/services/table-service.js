/**
 *
 * @param {Object | Array} item
 * @param {string} propertyName
 * @param {string} value
 * @returns boolean
 */
export const hasValue = (item, propertyName, value) => {
  const propertyValue = traverseObject(item, propertyName);

  if (propertyValue instanceof Array) {
    return propertyValue.includes(value);
  }
  return propertyValue === value;
}

export const traverseObject = (item, propertyName) => {
  const stack = propertyName.split(".");
  let prop = item.properties;
  while (stack.length) {
    prop = prop[stack.shift()];
  }

  return prop;
}

export default {
  hasValue,
  traverseObject
};
