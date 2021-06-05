export const getPersonRoleTranslation = role => {
  switch (role) {
    case "mythological":
      return "Mythologische Figur";
    case "fictional":
      return "Fiktionale Person";
    default:
      return "Reale Person";
  }
};

export default {
  getPersonRoleTranslation
};
