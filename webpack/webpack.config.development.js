const merge = require('webpack-merge');
const common = require('./webpack.config.js');
// const fs = require( 'fs' );

const host = 'localhost'
const port = (process.argv[2]) || 8900

const object = {
	devtool: 'inline-source-map',
	devServer: {
		open: true,
		host: host,
		port: 8900,
		hot: true,
		https: false,
		// key: fs.readFileSync('./webpack/server.key'),
		// cert: fs.readFileSync('./webpack/server.crt'),
		overlay: {
			errors: true,
			warnings: false,
		}
	}
};

module.exports = merge( common, object );