import { EDITION_NAME, EDITION_INSTITUTION } from "../shared/constants";

// Splits the title and returns the first part.
const getTitle = data => {
  const title = data.teiHeader.fileDesc.titleStmt.title.replace(/[\n ]+/g, " ");
  return title.split(/\. (?=([A-Z][a-zà-ý]*|St\.)( [a-zà-ý]*)?( [A-Z][a-zà-ý]*)?,)/)[0];
};

// Splits the title and returns the second part.
// Is different than titleMain because of lookbehind limitations.
const getSecondaryTitle = data => {
  const title = data.teiHeader.fileDesc.titleStmt.title.replace(/[\n ]+/g, " ");
  const secondPart = title.split(
    / .?.? ?[A-Z][a-zà-ý)]*( [a-zà-ý]*)?( [A-Z][a-zà-ý]*)?(-[A-Z][-a-zà-ý]*)?(\(\?\))?\./
  );

  return secondPart.pop().trim();
};

const getEditor = data => {
  if (!data.teiHeader.fileDesc.titleStmt.editor) {
    return "";
  }

  let forename = "";
  let surname = "";

  if (data.teiHeader.fileDesc.titleStmt.editor.persName.forename) {
    forename = data.teiHeader.fileDesc.titleStmt.editor.persName.forename;
  }

  if (data.teiHeader.fileDesc.titleStmt.editor.persName.surname) {
    surname = data.teiHeader.fileDesc.titleStmt.editor.persName.surname;
  }

  return [forename, surname].join(" ");
};

const getResponsible = data => {
  if (!data.teiHeader.fileDesc.titleStmt.respStmt) {
    return "";
  }

  let editorName = "";

  if (Array.isArray(data.teiHeader.fileDesc.titleStmt.respStmt)) {
    const editors = data.teiHeader.fileDesc.titleStmt.respStmt.map(editor => getEditorName(editor));
    const lastEditor = editors.pop();

    editorName = editors.join(", ") + " und " + lastEditor;
  } else {
    editorName = getEditorName(data.teiHeader.fileDesc.titleStmt.respStmt);
  }

  return editorName;
};

const getResponsibleList = data => {
  if (!data.teiHeader.fileDesc.titleStmt.respStmt) {
    return [];
  }

  if (Array.isArray(data.teiHeader.fileDesc.titleStmt.respStmt)) {
    return data.teiHeader.fileDesc.titleStmt.respStmt.map(editor => getEditorName(editor));
  }

  return [getEditorName(data.teiHeader.fileDesc.titleStmt.respStmt)];
};

const getEditorName = editor => {
  let forename = "";
  let surname = "";

  if (editor.persName.forename) {
    forename = editor.persName.forename;
  }

  if (editor.persName.surname) {
    surname = editor.persName.surname;
  }

  return [forename, surname].join(" ");
};

const getCitationRecommendation = data => {
  if (!data.teiHeader) {
    return "";
  }
  const title = getTitle(data);
  const secondaryTitle = getSecondaryTitle(data);
  const editor = getEditor(data);
  const responsible = getResponsible(data);

  let recommendation = `${title}. ${secondaryTitle}. In: ${EDITION_NAME}` + `. Hrsg. von ${editor}`;

  if (responsible) {
    recommendation += ` unter Mitarbeit von ${responsible}`;
  }

  recommendation += `. ${EDITION_INSTITUTION} 2017–2023. URL: `;

  return recommendation;
};

const flattenMentions = mentions => {
  return mentions.join(" ").split(" ");
};

export default {
  getTitle,
  getSecondaryTitle,
  getEditor,
  getResponsible,
  getResponsibleList,
  getCitationRecommendation,
  flattenMentions
};
