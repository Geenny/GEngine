const HtmlWebpackPlugin = require('html-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const outputPath = path.resolve(__dirname, '../dist');

const object = {
    mode: 'production',
    output: {
		path: outputPath,
        filename: './static/bundle.js',
        publicPath: '/'
	},
    optimization: {
        // minimizer: [
        //     new UglifyJSPlugin({
        //         uglifyOptions: {
        //             compress: {
        //                 warnings: false,
        //                 keep_fnames: true
        //             },
        //             mangle: {
        //                 keep_fnames: true
        //             },
        //             output: {
        //                 beautify: false,
        //                 comments: false
        //             },
        //             keep_fnames: true
        //         }
        //     })
        // ]
    },
    plugins: [
        new Visualizer({
            filename: './webpack-prod-stats.html'
        }),
        // new CopyWebpackPlugin([
        //     { from: './src/assets/fonts', to: 'assets/fonts' }
        // ]),
        new HtmlWebpackPlugin({
            template: 'index.html',
            inject: false,
            minify: {
                collapseWhitespace: true,
                minifyCSS: true,
                minifyJS: true,
                removeComments: true
            }
        }),
        new MiniCssExtractPlugin({ filename: '[name].css', chunkFilename: '[id].css' })
    ]
}

module.exports = object;

