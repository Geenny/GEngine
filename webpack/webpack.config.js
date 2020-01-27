const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

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
		publicPath: '/'
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
		new webpack.HotModuleReplacementPlugin(),
		new CopyWebpackPlugin([
            { from: './src/assets', to: 'assets' }
        ]),
	],
	module: {
		// loaders: [
		// 	{
		// 		test: /\.js$/,
		// 		loader: 'babel-loader',
		// 		query: {
		// 			presets: ['es2015']
		// 		}
		// 	}
		// ],
		rules: [
			// {
			// 	test: /node_modules[/\\]tweenjs/,
			// 	loader: 'babel-loader'
			// }
			// { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
			// { test: /\.less$/, use: [ 'style-loader', 'css-loader', 'postcss-loader', 'less-loader' ] },
			// { test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/, use: [ 'file-loader' ] },
			// { test: /\.(png|jpg|gif)$/, use: [ { loader: 'url-loader', options: { limit: 100000 } } ] }
		]
	}
}
