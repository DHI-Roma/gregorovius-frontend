/* eslint-env node */

import { defineConfig } from '#q-app/wrappers';

export default defineConfig(function (/* ctx */) {
  return {
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

    extras: [
      'material-icons'
    ],

    build: {
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node22'
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
      workboxMode: 'GenerateSW'
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
