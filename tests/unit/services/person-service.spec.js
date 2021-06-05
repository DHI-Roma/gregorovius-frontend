import personService from "@/services/person-service";

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
});
