/* eslint-disable import/prefer-default-export */

export const getXsltPath = (xsltName) => {
  switch (xsltName) {
    case "LettersMsDesc":
      return "@/assets/xslt/LettersMsDesc.xslt";
    case "LettersText":
      return "@/assets/xslt/LettersText.xslt";
    case "WorkTitle":
      return "@/assets/xslt/WorkTitle.xslt";
    default:
      throw new Error("XSLT not implemented");
  }
}


export const processXML = async(xmlString, xsltName) => {
  try {
    const stylesheetModule = await import(getXsltPath(xsltName));
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
    getXsltPath,
    processXML
  }
};
