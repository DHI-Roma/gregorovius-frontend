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
    },
    devServer: {
      hot: true,
    },
    watch: true,
    watchOptions: {
      ignored: /node_modules/,
      poll: 1000,
    },
  },
  devServer: {
    disableHostCheck: true,
    host: '0.0.0.0',
  },
};
