module.exports = {
  pluginOptions: {
    quasar: {
      animations: "all"
    }
  },
  transpileDependencies: [/[\\/]node_modules[\\/]quasar[\\/]/],
  runtimeCompiler: true,
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.xslt$/i,
          use: "raw-loader"
        }
      ]
    }
  }
};
