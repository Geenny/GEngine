const webpack = require('webpack')

const host = 'localhost'
const port = (process.argv[2]) || 8900

module.exports = {
  mode: 'development',
  devtool: 'source-map',
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
  externals: {
    config: 'config'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}

// mode: 'development',
//     devtool: 'source-map',
//     plugins: [
//         new HtmlWebpackPlugin({
//             template: 'src/index.hbs',
//             inject: false,
//             test: { devBundlePostfix }
//         }),
//         new webpack.DefinePlugin({
//             'process.env.NODE_ENV': JSON.stringify('development'),
//             devStartOptions: JSON.stringify(devStartOptions)
//         }),
//         new CopyWebpackPlugin([
//             { from: './src/assets', to: 'assets' },
//             { from: './node_modules/pandora/modules/pandora-webtrekk-plugins/', to: 'assets/webtrekk-plugins/' }
//         ]),
//         new MiniCssExtractPlugin({ filename: '[name].css', chunkFilename: '[id].css' }),
//         new HtmlWebpackPluginIncludeInline({ css: ['game-development.css'] })
//     ]
