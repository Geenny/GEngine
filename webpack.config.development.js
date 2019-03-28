const merge = require('webpack-merge')
const webpack = require('webpack')
const common = require('./webpack.config.js');

const host = 'localhost'
const port = (process.argv[2]) || 8900

const object = {
	// mode: 'development',
	// devtool: 'source-map',
	// entry: {
	// 	mainjs: [
	// 		'webpack-dev-server/client?http://' + host + ':' + port,
	// 		'webpack/hot/dev-server',
	// 		'./src/index.js'
	// 	],
	// },
	// output: {
	// 	path: __dirname,
	// 	filename: 'bundle.js',
	// 	publicPath: '/static/'
	// },
	// externals: {
	// 	config: 'config'
	// },
	// plugins: [
	// 	new webpack.HotModuleReplacementPlugin()
	// ]
}

module.exports = merge(common, object);

