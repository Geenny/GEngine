const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('./webpack.config')

const port = (process.argv[2]) || 8009;

new WebpackDevServer(webpack(config), {
  disableHostCheck: true,
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Listening at localhost:', port);
})
