const refreshZotero = () => {
  document.dispatchEvent(
    new Event("ZoteroItemUpdated", {
      bubbles: true,
      cancelable: true
    })
  );
};

const setMetaTitle = title => {
  document.querySelector('meta[name="citation_title"]').setAttribute("content", title);
};

const setMetaAuthors = authors => {
  const oldNodes = document.querySelectorAll('meta[name="citation_author"]');
  oldNodes.forEach(node => node.parentElement.removeChild(node));

  authors.forEach(author => {
    const newAuthorNode = document.createElement("meta");
    newAuthorNode.setAttribute("name", "citation_author");
    newAuthorNode.setAttribute("content", author);

    document.querySelector("head").appendChild(newAuthorNode);
  });
};

export default {
  setMetaTitle,
  setMetaAuthors,
  refreshZotero
};
