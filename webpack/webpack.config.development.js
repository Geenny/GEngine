const { merge } = require( 'webpack-merge' );
const common = require( './webpack.config.js' );

const host = 'localhost';
const port = 8900;

const object = {
	mode: 'development',
	output: {
		path: __dirname,
		filename: 'bundle.js',
		clean: true
	},
	devtool: "cheap-module-source-map",
	devServer: {
		host: host,
		port: port,
		hot: true,
	}
};

module.exports = merge( common, object );