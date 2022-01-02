const webpack = require( 'webpack' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );

const host = 'localhost';
const port = 8900;

module.exports = {
	mode: 'development',
	entry: {
		mainjs: [
			'webpack-dev-server/client?http://' + host + ':' + port,
			'webpack/hot/dev-server',
			'./index.ts'
		],
	},
	externals: {
		config: 'config'
	},
	output: {
		path: __dirname,
		filename: 'bundle.js',
		clean: true
	},
	resolve: {
		extensions: [ '.ts', '.js' ],
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new CopyWebpackPlugin({
			patterns: [
            	// { from: './src/assets', to: 'assets' },
            	{ from: './src/assets/favicon.ico', to: 'favicon.ico' },
				{ from: './index.html', to: 'index.html' }
			]
		})
	],
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			}//,
			// {
			// 	test: /\.js$/,
			// 	exclude: /node_modules/,
			// 	loader: 'babel-loader',
			// 	query: {
			// 		presets: [ 'es2015', 'stage-0' ]
			// 	}
			// }
		]
	}
}
