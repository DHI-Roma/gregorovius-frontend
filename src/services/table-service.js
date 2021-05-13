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
};

export const traverseObject = (item, propertyName) => {
  const stack = propertyName.split(".");
  let prop = item.properties;
  while (stack.length) {
    prop = prop[stack.shift()];
  }

  return prop;
};

export const filterByRecipients = (rows, selectedRecipients) => {
  const rowCollection = [];

  if (selectedRecipients.length) {
    selectedRecipients.forEach(recipient => {
      const elibibleRows = rows.filter(row => hasValue(row, "recipient", recipient));
      rowCollection.push(...elibibleRows);
    });
  }

  if (rowCollection.length) {
    return rowCollection;
  }

  return rows;
};

export default {
  hasValue,
  traverseObject,
  filterByRecipients
};
