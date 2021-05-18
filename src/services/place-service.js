export const getPlaceTypeTranslation = placeType => {
  switch (placeType) {
    case "mythological":
      return "Mythischer Ort";
    case "building":
      return "Gebäude";
    case "monument":
      return "Monument";
    case "river":
    case "sea":
      return "Fluss, See, Meer";
    case "park":
      return "Park";
    case "mountains":
    case "mountain":
      return "Gebirge, Berg, Hügel";
    case "settlement":
      return "Siedlung";
    case "district":
      return "Stadtviertel";
    case "street":
      return "Straße";
    case "forest":
      return "Wald";
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
    case "sea":
      return "blue-1";
    case "mountains":
    case "mountian":
      return "grey-2";
    case "settlement":
      return "brown-1";
    case "district":
      return "yellow-1";
    default:
      return "grey-1";
  }
};

export default {
  getPlaceTypeTranslation,
  getPlaceTypeClass
};
