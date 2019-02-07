const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('./webpack.config.development')
const open = require('open')
// const path = require('path')

// const host = process.argv[1] || 'localhost'
// const port = (process.argv[2]) || 8098;
const link = { host: 'localhost', port: 8900 }
const compiler = webpack(config)
const options = {
  disableHostCheck: true,
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}

const server = new WebpackDevServer(compiler, options);
server.listen(link.port, link.host, function() {
  open(`http://${link.host}:${link.port}/index.html`)
});

// const params = {
//   host: 'localhost',
//   port: 8900
// };
// process.argv.forEach(function (val) {
//   params[val.split('=')[0]] = val.split('=')[1];
// });
// const config = require(path.resolve(params.config));
