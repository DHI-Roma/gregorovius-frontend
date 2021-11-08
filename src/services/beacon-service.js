import { API } from "@/../env";
import axios from "axios";

const hasGnd = function(personEntity) {
  if (personEntity.properties.gnd && personEntity.properties.gnd.length) {
    return true;
  }

  return false;
};

const getGnd = function(personEntity) {
  const gndUriParts = personEntity.properties.gnd.split("/");

  return gndUriParts[gndUriParts.length - 1];
};

const getSeeAlsoEntries = async function(gnd) {
  const url = `${API}/beacon/seeAlso/${gnd}`;
  const response = await axios.get(url);
  return response.data;
};

export default {
  hasGnd,
  getGnd,
  getSeeAlsoEntries
};
