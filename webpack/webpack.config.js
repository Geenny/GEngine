const webpack = require('webpack')

const host = 'localhost'
const port = (process.argv[2]) || 8900

module.exports = {
	mode: 'development',
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
	resolve: {
		alias: {
			// tweenjs: 'tweenjs/lib/tweenjs.js'
		}
	},
	externals: {
		config: 'config'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	],
	module: {
		rules: [
			// {
			// 	test: /node_modules[/\\]tweenjs/,
			// 	loader: 'babel-loader'
			// }
			// { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
			// { test: /\.less$/, use: [ 'style-loader', 'css-loader', 'postcss-loader', 'less-loader' ] },
			// { test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/, use: [ 'file-loader' ] },
			// { test: /\.(png|jpg|gif)$/, use: [ { loader: 'url-loader', options: { limit: 100000 } } ] }
		],
	}
}
