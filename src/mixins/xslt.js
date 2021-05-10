/* eslint-disable import/prefer-default-export */

import * as LettersMsDescXslt from "@/assets/xslt/LettersMsDesc.xslt";
import * as LettersTextXslt from "@/assets/xslt/LettersText.xslt";
import * as WorkTitleXslt from "@/assets/xslt/WorkTitle.xslt";

export const getXslt = (xsltName) => {
  switch (xsltName) {
    case "LettersMsDesc":
      return LettersMsDescXslt;
    case "LettersText":
      return LettersTextXslt;
    case "WorkTitle":
      return WorkTitleXslt;
    default:
      throw new Error("XSLT not implemented");
  }
}


export const processXML = async(xmlString, xsltName) => {
  try {
    const stylesheetModule = getXslt(xsltName);
    const xsltStylesheet = stylesheetModule.default;
    const parser = new DOMParser();
    const xmlParsed = parser.parseFromString(xmlString, "text/xml");
    const xsltParsed = parser.parseFromString(xsltStylesheet, "text/xml");
    const processor = new XSLTProcessor();
    processor.importStylesheet(xsltParsed);
    const html = processor.transformToDocument(xmlParsed);
    return `<div class="edition-text" xmlns:v-bind="https://vuejs.org/v2/api/#v-bind"
        xmlns:v-on="https://vuejs.org/v2/api/#v-on">${html.documentElement.innerHTML}</div>`;
  } catch (error) {
    console.error(error);
    return "";
  }
};

export const xslt = {
  methods: {
    getXslt,
    processXML
  }
};
