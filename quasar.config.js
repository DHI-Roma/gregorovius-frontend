import { defineConfig } from '#q-app';

export default defineConfig(function (ctx) {
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

      // components use the Options API
      vueOptionsAPI: true,

      vitePlugins: [
        // Vue compiler with runtime template support
      ],

      alias: {
        // Alias for runtime template compiler
        vue: 'vue/dist/vue.esm-bundler.js',
        // app-vite 3 only injects '@/', keep the old aliases working
        src: ctx.appPaths.srcDir,
        layouts: ctx.appPaths.resolve.src('layouts'),
        pages: ctx.appPaths.resolve.src('pages')
      }
    },

    devServer: {
      open: true,
      // served behind the traefik router as gregorovius.local in the docker env
      allowedHosts: ['gregorovius.local']
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
