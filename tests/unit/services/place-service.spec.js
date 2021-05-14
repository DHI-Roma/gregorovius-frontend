import placeService from "@/services/place-service";
describe("PlaceService", () => {
  describe("#getPlaceTypeTranslation", () => {
    it("gets the translation for places", () => {
      expect(placeService.getPlaceTypeTranslation("mythological")).toBe("Mythischer Ort");
      expect(placeService.getPlaceTypeTranslation("building")).toBe("Gebäude");
      expect(placeService.getPlaceTypeTranslation("monument")).toBe("Monument");
      expect(placeService.getPlaceTypeTranslation("river")).toBe("Gewässer");
      expect(placeService.getPlaceTypeTranslation("mountains")).toBe("Gebirge");
      expect(placeService.getPlaceTypeTranslation("settlement")).toBe("Siedlung");
      expect(placeService.getPlaceTypeTranslation("district")).toBe("Stadtviertel");
    });

    it("passes the original value when no match could be found", () => {
      expect(placeService.getPlaceTypeTranslation("factory")).toBe("factory");
    });
  });
});
