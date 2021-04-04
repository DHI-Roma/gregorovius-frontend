The **Gregorovius Frontend** repo contains the main frontend of the [Gregorovius Correspondence Edition](https://gregorovius-edition.dhi-roma.it) and the [Edition Guidelines](https://gregorovius-edition.dhi-roma.it/richtlinien).

# Main frontend

The edition's main frontend is built as a SPA with [Vue.js](https://vuejs.org/), [Vue CLI](https://cli.vuejs.org/) and [Quasar](https://quasar.dev/). 

## Setup for development

Make sure you have npm installed, `cd` into the root project directory and run

```shell
npm install
```

to install all required dependencies.

To compile and hot-reload for development run

```shell
npm run serve
```

## Testing

This project used [Jest](https://jestjs.io/) as its main testing framework.

Run tests with:

```shell
npm run test:unit
```

# Edition Guidelines

The edition guidelines are built with [MkDocs](https://www.mkdocs.org/) and [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/).
The content is all markdown-based and the structure of the page can be configured with a central configuration file (see the MkDocs documentation).

## Setup for development

Make sure you have Python and MkDocs installed, `cd` into the `edition-docs` directory and run

```shell
mkdocs serve
```
