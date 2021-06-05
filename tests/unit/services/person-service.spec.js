import personService from "@/services/person-service";
import { persons } from "../fixtures/persons";

describe("PersonService", () => {
  it("translates the role types", () => {
    expect(personService.getPersonRoleTranslation(null)).toBe("Person");
    expect(personService.getPersonRoleTranslation("")).toBe("Person");
    expect(personService.getPersonRoleTranslation("mythological")).toBe("Mythologische Figur");
    expect(personService.getPersonRoleTranslation("fictional")).toBe("Fiktionale Person");
  });

  it("gets the color class depending on the role", () => {
    expect(personService.getPersonRoleClass(null)).toBe("orange-1");
    expect(personService.getPersonRoleClass("")).toBe("orange-1");
    expect(personService.getPersonRoleClass("mythological")).toBe("purple-1");
    expect(personService.getPersonRoleClass("fictional")).toBe("cyan-1");
  });

  it("tranlsates the person types", () => {
    expect(personService.getPersonTypeTranslation(null)).toBe("Person");
    expect(personService.getPersonTypeTranslation("")).toBe("Person");
    expect(personService.getPersonTypeTranslation("person")).toBe("Person");
    expect(personService.getPersonTypeTranslation("organisation")).toBe("Körperschaft");
    expect(personService.getPersonTypeTranslation("org")).toBe("Körperschaft");
  });

  it("gets the color class depending on the person type", () => {
    expect(personService.getPersonTypeClass(null)).toBe("orange-1");
    expect(personService.getPersonTypeClass("")).toBe("orange-1");
    expect(personService.getPersonTypeClass("person")).toBe("orange-1");
    expect(personService.getPersonTypeClass("organisation")).toBe("blue-1");
    expect(personService.getPersonTypeClass("org")).toBe("blue-1");
  });

  it("translates the alternative name subtype", () => {
    expect(personService.getPersonAlternativeNameTypeTranslation(null)).toBe("Alternativ");
    expect(personService.getPersonAlternativeNameTypeTranslation("")).toBe("Alternativ");
    expect(personService.getPersonAlternativeNameTypeTranslation("birthname")).toBe("Geburtsname");
    expect(personService.getPersonAlternativeNameTypeTranslation("pseudonym")).toBe("Pseudonym");
  });

  it("checks whether there an entry has a differing simple name", () => {
    // Sindbad entry
    const sindbad = persons[2];
    sindbad.properties.name.fullName = "Sindbad";
    sindbad.properties.name.simpleName = "Sindbad";
    expect(personService.hasDifferentSimpleName(sindbad)).toBeFalsy();

    // Null entry
    const nullEntry = persons[2];
    sindbad.properties.name.fullName = "Sindbad";
    sindbad.properties.name.simpleName = null;
    expect(personService.hasDifferentSimpleName(nullEntry)).toBeFalsy();

    // Differing entry
    const differingEntry = persons[2];
    sindbad.properties.name.fullName = "Sindbad";
    sindbad.properties.name.simpleName = "Cindy";
    expect(personService.hasDifferentSimpleName(differingEntry)).toBeTruthy();
  });

  it("gets an alternative name, if there is one", () => {
    const noAltName = persons[0];
    noAltName.properties.name.altSurname = null;
    noAltName.properties.name.altForename = null;
    noAltName.properties.name.altSimpleName = null;
    expect(personService.hasAlternativeName(noAltName)).toBeFalsy();

    const altNameExample = persons[5];
    altNameExample.properties.name.altSurname = "Florentin";
    altNameExample.properties.name.altForename = "Theodor";

    expect(personService.hasAlternativeName(altNameExample)).toBeTruthy();
    expect(personService.getAlternativeFullName(altNameExample)).toBe("Florentin, Theodor");

    const altNameSurnameExample = persons[5];
    altNameSurnameExample.properties.name.altSurname = "Florentin";
    altNameSurnameExample.properties.name.altForename = null;

    expect(personService.hasAlternativeName(altNameExample)).toBeTruthy();
    expect(personService.getAlternativeFullName(altNameExample)).toBe("Florentin");

    const altNameForenameExample = persons[5];
    altNameForenameExample.properties.name.altSurname = null;
    altNameForenameExample.properties.name.altForename = "Theodor";

    expect(personService.hasAlternativeName(altNameExample)).toBeTruthy();
    expect(personService.getAlternativeFullName(altNameExample)).toBe("Theodor");
  });
});
