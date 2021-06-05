export const getPersonRoleTranslation = role => {
  switch (role) {
    case "mythological":
      return "Mythologische Figur";
    case "fictional":
      return "Fiktionale Person";
    default:
      return "Person";
  }
};

export const getPersonRoleClass = role => {
  switch (role) {
    case "mythological":
      return "purple-1";
    case "fictional":
      return "cyan-1";
    default:
      return "orange-1";
  }
};

export const getPersonTypeTranslation = personType => {
  switch (personType) {
    case "organisation":
    case "org":
      return "Körperschaft";
    case "person":
    default:
      return "Person";
  }
};

export const getPersonTypeClass = personType => {
  switch (personType) {
    case "organisation":
    case "org":
      return "blue-1";
    case "person":
    default:
      return "orange-1";
  }
};

export const getPersonAlternativeNameTypeTranslation = subType => {
  switch (subType) {
    case "birthname":
      return "Geburtsname";
    case "pseudonym":
      return "Pseudonym";
    default:
      return "Alternativ";
  }
};

export const hasDifferentSimpleName = person => {
  if (!person.properties.name.simpleName) {
    return false;
  }
  return person.properties.name.fullName !== person.properties.name.simpleName;
};

export const hasAlternativeName = person => {
  return (
    person.properties.name.altForename ||
    person.properties.name.altSurname ||
    person.properties.name.altSimpleName
  );
};

export const getAlternativeFullName = person => {
  let name = "";

  if (person.properties.name.altSurname) {
    name += person.properties.name.altSurname;
  }

  if (person.properties.name.altSurname && person.properties.name.altForename) {
    name += ", ";
  }

  if (person.properties.name.altForename) {
    name += person.properties.name.altForename;
  }

  return name;
};

export default {
  getPersonRoleTranslation,
  getPersonRoleClass,
  getPersonTypeTranslation,
  getPersonTypeClass,
  hasDifferentSimpleName,
  hasAlternativeName,
  getAlternativeFullName,
  getPersonAlternativeNameTypeTranslation
};
