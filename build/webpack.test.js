const path = require('path');
const webpackBase = require('./webpack.base');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

module.exports = merge(webpackBase, {
	mode: 'development',
	devtool: 'inline-source-map',
	entry: {
		bundle: [
			path.resolve('test/index.js'),
		]
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.js$/,
				include: [
					/@babel\/polyfill/
				],
				use: [
					'babel-loader'
				],
			}
		]
	},
	devServer: {
		port: config.dev.port,
		host: '0.0.0.0',
		hot: false,
		inline: false
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: path.resolve(__dirname, './template/index.html'),
			templateParameters: {
				frameURL: require('./frame-server').rootFrameURL
			},
			inject: 'head'
		}),
	],
	node: {
		Buffer: true,
	}
});