import placeService from "@/services/place-service";
describe("PlaceService", () => {
  describe("#getPlaceTypeTranslation", () => {
    it("gets the translation for places", () => {
      expect(placeService.getPlaceTypeTranslation("mythological")).toBe("Mythischer Ort");
      expect(placeService.getPlaceTypeTranslation("building")).toBe("Gebäude");
      expect(placeService.getPlaceTypeTranslation("monument")).toBe("Monument");
      expect(placeService.getPlaceTypeTranslation("river")).toBe("Fluss, See, Meer");
      expect(placeService.getPlaceTypeTranslation("sea")).toBe("Fluss, See, Meer");
      expect(placeService.getPlaceTypeTranslation("park")).toBe("Park");
      expect(placeService.getPlaceTypeTranslation("mountains")).toBe("Gebirge, Berg, Hügel");
      expect(placeService.getPlaceTypeTranslation("settlement")).toBe("Siedlung");
      expect(placeService.getPlaceTypeTranslation("district")).toBe("Stadtviertel");
      expect(placeService.getPlaceTypeTranslation("street")).toBe("Straße");
      expect(placeService.getPlaceTypeTranslation("forest")).toBe("Wald");
    });

    it("passes the original value when no match could be found", () => {
      expect(placeService.getPlaceTypeTranslation("factory")).toBe("factory");
    });
  });
});
