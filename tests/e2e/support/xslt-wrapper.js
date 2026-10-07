// Mirrors gregorovius-api/service/main.py `sanitize_stylesheet`.
// Keep both in sync: the API wraps the stylesheet fragment sent by the frontend
// into an xsl:stylesheet element with these namespaces before running libxslt.

const RED_FLAGS = ['xsl:import', 'xsl:load', 'document(', '<![CDATA['];

/**
 * @param {string} stylesheet stylesheet fragment as POSTed by the frontend
 * @returns {string} complete stylesheet, or '' if it contains a red flag
 */
export function wrapStylesheet(stylesheet) {
  if (RED_FLAGS.some((flag) => stylesheet.includes(flag))) {
    return '';
  }
  return (
    '<xsl:stylesheet ' +
    'xmlns:xsl="http://www.w3.org/1999/XSL/Transform" ' +
    'xmlns:telota="http://www.telota.de" ' +
    'xmlns:tei="http://www.tei-c.org/ns/1.0" ' +
    'xmlns:v-bind="https://vuejs.org/v2/api/#v-bind" ' +
    'xmlns:v-on="https://vuejs.org/v2/api/#v-on" ' +
    'xmlns:func="http://exslt.org/functions" ' +
    'extension-element-prefixes="func">' +
    `${stylesheet}` +
    '</xsl:stylesheet>'
  );
}
