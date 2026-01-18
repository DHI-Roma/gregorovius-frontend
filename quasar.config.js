/* eslint-env node */

const { configure } = require('quasar/wrappers');

module.exports = configure(function (/* ctx */) {
  return {
    eslint: {
      warnings: true,
      errors: true
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#sourcefiles
    sourceFiles: {
      rootComponent: 'src/App.vue',
      router: 'src/router/index',
      store: 'src/stores/index',
    },

    boot: [
      'axios',
      'matomo',
      'global-components'
    ],

    css: [
      'app.scss'
    ],

    sassVariables: 'src/css/quasar.variables.scss',

    extras: [
      'material-icons'
    ],

    build: {
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node20'
      },

      vueRouterMode: 'history',

      vitePlugins: [
        // Vue compiler with runtime template support
      ],

      // Alias for runtime template compiler
      alias: {
        vue: 'vue/dist/vue.esm-bundler.js'
      }
    },

    devServer: {
      open: true
    },

    framework: {
      config: {},
      plugins: [
        'Loading',
        'Notify'
      ],
      lang: 'de'
    },

    animations: [],

    ssr: {
      pwa: false,
      prodPort: 3000,
      middlewares: [
        'render'
      ]
    },

    pwa: {
      workboxMode: 'generateSW'
    },

    capacitor: {
      hideSplashscreen: true
    },

    electron: {
      inspectPort: 5858,
      bundler: 'packager'
    }
  };
});
