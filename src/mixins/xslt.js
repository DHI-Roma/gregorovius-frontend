import LettersMsDescXslt from "src/assets/xslt/LettersMsDesc.xslt?raw";
import LettersTextXslt from "src/assets/xslt/LettersText.xslt?raw";
import WorkTitleXslt from "src/assets/xslt/WorkTitle.xslt?raw";

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
    const xsltStylesheet = getXslt(xsltName);
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
