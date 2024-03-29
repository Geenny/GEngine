const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const outputPath = path.resolve(__dirname, '../dist');

const object = {
    mode: 'production',
    output: {
		path: outputPath,
        filename: './bundle.js',
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
        new CopyWebpackPlugin([
            { from: './src/assets', to: 'assets' }
        ]),
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

