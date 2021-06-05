import personService from "@/services/person-service";

describe("PersonService", () => {
  it("translates the role types", () => {
    expect(personService.getPersonRoleTranslation(null)).toBe("Reale Person");
    expect(personService.getPersonRoleTranslation("")).toBe("Reale Person");
    expect(personService.getPersonRoleTranslation("mythological")).toBe("Mythologische Figur");
    expect(personService.getPersonRoleTranslation("fictional")).toBe("Fiktionale Person");
  });
});
