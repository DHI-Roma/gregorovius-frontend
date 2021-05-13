module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  moduleNameMapper: {
    "^.+\\.xslt$": "<rootDir>/__mocks__/xsltMock.js"
  }
};
