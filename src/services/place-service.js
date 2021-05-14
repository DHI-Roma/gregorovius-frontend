export const getPlaceTypeTranslation = placeType => {
  switch (placeType) {
    case "mythological":
      return "Mythischer Ort";
    case "building":
      return "Gebäude";
    case "monument":
      return "Monument";
    case "river":
      return "Gewässer";
    case "mountains":
      return "Gebirge";
    case "settlement":
      return "Siedlung";
    case "district":
      return "Stadtviertel";
    default:
      return placeType;
  }
};

export const getPlaceTypeClass = placeType => {
  switch (placeType) {
    case "mythological":
      return "pink-1";
    case "building":
      return "green-1";
    case "monument":
      return "cyan-1";
    case "river":
      return "blue-1";
    case "mountains":
      return "grey-2";
    case "settlement":
      return "brown-1";
    case "district":
      return "yellow-1";
    default:
      return placeType;
  }
};

export default {
  getPlaceTypeTranslation,
  getPlaceTypeClass
};
