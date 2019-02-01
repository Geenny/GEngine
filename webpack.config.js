const port = (process.argv[2]) || 8009

module.exports = {
  mode: 'development',
  entry: {
    mainjs: [
      'webpack-dev-server/client?http://localhost:' + port,
      'webpack/hot/dev-server'
    ]
  },
  output: {
    path: __dirname,
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  externals: {
    config: 'config'
  }
}
