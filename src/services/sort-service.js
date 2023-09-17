export const sortLetterByDate = (letterA, letterB) => {
  if (letterA.properties.date > letterB.properties.date) {
    return 1;
  }

  if (letterA.properties.date < letterB.properties.date) {
    return -1;
  }

  return 0;
};
