/**
 *
 * @param {Object | Array} item
 * @param {string} property
 * @param {string} value
 * @returns boolean
 */
export const hasValue = (item, property, value) => {
  const stack = property.split(".");
  let prop = item.properties;
  while (stack.length) {
    prop = prop[stack.shift()];
  }

  if (prop instanceof Array) {
    return prop.includes(value);
  }
  return prop === value;
}

export default {
  hasValue
};
