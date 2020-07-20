'use strict';

const path = require('path');

const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
	mode: 'development',
	entry: [
		'./example/src/main.js'
	],
	output: {
		path: path.resolve(__dirname, './example'),
		filename: 'bundle.js'
	},
	devServer: {
		contentBase: path.join(__dirname, './example'),
		open: true,
		watchOptions: {
			poll: true
		}
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				use: 'vue-loader'
			},
			{
				test: /\.js$/,
				loader: 'babel-loader'
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
				]
			}
		]
	},
	plugins: [
		new VueLoaderPlugin()
	],
};
