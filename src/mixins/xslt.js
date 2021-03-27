/* eslint-disable import/prefer-default-export */

export const xslt = {
  methods: {
    async processXML(xmlString, xsltName) {
      try {
        const stylesheetModule = await import(`@/assets/xslt/${xsltName}.xslt`);
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
    }
  }
};
