The **Gregorovius Frontend** repo contains the main frontend of the [Gregorovius Correspondence Edition](https://gregorovius-edition.dhi-roma.it) and the [Edition Guidelines](https://gregorovius-edition.dhi-roma.it/richtlinien).

# Main frontend

The edition's main frontend is built as a SPA with [Vue.js](https://vuejs.org/), [Vue CLI](https://cli.vuejs.org/) and [Quasar](https://quasar.dev/). 

## Setup for development

Make sure you have npm installed, `cd` into the root project directory and run

```shell
npm install
```

to install all required dependencies.

Copy the `env.dist.js` to `env.js` and change the contents if necessary.

```shell
cp env.dist.js env.js
```

To compile and hot-reload for development run

```shell
npm run serve
```

## Testing

End-to-end tests ([Playwright](https://playwright.dev/)) cover the main user flows in Chromium and WebKit.
They run against a production build and a mocked API that serves recorded fixtures from `tests/e2e/fixtures/api`,
so no network access is needed. Letter texts are transformed by the mock with `xsltproc` (libxslt, the same engine
as the API), which therefore has to be installed (preinstalled on macOS, `sudo apt-get install xsltproc` on Debian/Ubuntu).

```shell
npx playwright install chromium webkit   # once

npm run test:unit                        # unit tests (Vitest, tests/unit)
npm run test:e2e                         # E2E tests (builds the app, Chromium + WebKit)
npm run test:e2e -- --ui                 # interactive mode
npx playwright show-report               # report of the last run
```

Every page is also scanned with [axe](https://github.com/dequelabs/axe-core). Known violations are listed in
`tests/e2e/a11y/allowlist.json`; new violations fail the tests. After fixing accessibility issues, rewrite the
baseline with

```shell
E2E_A11Y_UPDATE=1 npx playwright test a11y --project=chromium --workers=1
```

Tests marked with `test.fail` document known bugs; they start failing once the bug is fixed and should then be
turned into regular tests.

Fixtures are a reduced, consistent snapshot of the live API (read-only requests). To re-record them:

```shell
npm run e2e:record -- --dry-run   # show selection and size only
npm run e2e:record
```

Smoke tests against a running stack (by default the local Docker setup at `http://gregorovius.local`), including a
check that the mock's XSLT output equals the API's:

```shell
npm run test:e2e:smoke
E2E_SMOKE_URL=https://example.org npm run test:e2e:smoke
```

# Edition Guidelines

The edition guidelines are built with [MkDocs](https://www.mkdocs.org/) and [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/).
The content is all markdown-based and the structure of the page can be configured with a central configuration file (see the MkDocs documentation).

## Setup for development

Make sure you have Python and MkDocs installed, `cd` into the `edition-docs` directory and run

```shell
mkdocs serve
```
