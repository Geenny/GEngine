const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.config.js');

const host = 'localhost'
const port = (process.argv[2]) || 8900

const object = {}

module.exports = merge(common, object);

