const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('./webpack.config')

const host = process.argv[1] || 'localhost'
const port = (process.argv[2]) || 8098;

new WebpackDevServer(webpack(config), {
  disableHostCheck: true,
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(port, (error) => {
  if (error) {
    console.log(error)
    return
  }
  console.log('START!!!')
  open(`http://${host}:${port}/index.html?a=1`)
})