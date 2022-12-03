/* eslint-disable func-names */
import axios from "axios";
import { xslt } from "../mixins/xslt";

import { API } from "../../env";

const parseList = response => {
  if (response.status !== 200) throw Error(response.message);
  if (!response.data) return [];
  let list = response.data;
  if (typeof list !== "object") {
    list = [];
  }
  return list;
};

const parseItem = (response, code) => {
  if (response.status !== code) throw Error(response.message);
  let item = response.data;
  if (typeof item !== "object") {
    item = "";
  }
  return item;
};

const getVersion = async () => {
  try {
    const response = await axios.get(`${API}/version/`);
    return response.data.version;
  } catch (error) {
    console.error(`${error}: Unable to load version`);
    return "";
  }
};

const getEntities = async function(entityName) {
  try {
    const response = await axios.get(`${API}/${entityName}`, {
      headers: {
        Accept: "application/json"
      }
    });

    const data = parseList(response, 200);
    return data;
  } catch (error) {
    console.error(`${error}: Could not load ${entityName}`);
    return [];
  }
};

const getEntity = async function(entityName, id, format) {
  try {
    const response = await axios.get(`${API}/${entityName}/${id}`, {
      headers: {
        Accept: `application/${format}`
      }
    });
    const entity = parseItem(response, 200);
    return entity;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getLetters = async function() {
  try {
    const response = await axios.get(`${API}/letters`, {
      headers: {
        Accept: "application/json"
      }
    });
    const data = parseList(response);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getFacsimiles = async () => {
  try {
    const response = await axios.get(`${API}/facsimiles/`, {
      headers: {
        Accept: "application/json"
      }
    });

    return response?.data ?? {};
  } catch (error) {
    console.error(error);
    return {};
  }
};

const getSearchResults = async function(entityName, searchInput) {
  try {
    const response = await axios.get(`${API}/search`, {
      headers: {
        Accept: "application/json"
      },
      params: {
        entity: entityName,
        q: searchInput,
        width: "60"
      }
    });
    return parseList(response);
  } catch (error) {
    console.error(error);
    return [];
  }
};

const XSLTransform = async function(path, xsltName) {
  try {
    const stylesheetModule = xslt.methods.getXslt(xsltName);
    const stylesheet = stylesheetModule.default;
    const response = await axios.post(`${API}${path}`, stylesheet, {
      params: {
        xslt: true
      }
    });
    if (response.data === "") {
      return "";
    }
    return `<div xmlns:v-bind="https://vuejs.org/v2/api/#v-bind"
          xmlns:v-on="https://vuejs.org/v2/api/#v-on">${response.data}</div>`;
  } catch (error) {
    console.error(error);
    return "";
  }
};

export const dataService = {
  getEntities,
  getEntity,
  getLetters,
  getSearchResults,
  getVersion,
  getFacsimiles,
  XSLTransform
};
