const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('./webpack.config.development')
const open = require('open')
// const path = require('path')

const link = { host: 'localhost', port: 8900 }
const compiler = webpack( config );
const options = {
  disableHostCheck: true,
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}

const server = new WebpackDevServer( compiler, options );
server.listen(link.port, link.host, () => {
  open( `http://${link.host}:${link.port}/index.html` );
});
