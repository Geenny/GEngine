const webpack = require('webpack')

const host = 'localhost'
const port = (process.argv[2]) || 8900

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    mainjs: [
      'webpack-dev-server/client?http://' + host + ':' + port,
      'webpack/hot/dev-server',
      './src/index.js'
    ],
  },
  output: {
    path: __dirname,
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  externals: {
    config: 'config'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}

