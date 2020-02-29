const path = require('path');

const config = {
	target: 'electron-main',
	entry: [path.resolve(__dirname, 'index.js')],
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'build'),
	},
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.(tsx|ts|js)$/,
				include: [path.resolve(__dirname, '.')],
				use: {
					loader: 'babel-loader',
					options: {
						cacheDirectory: true,
						presets: ['module:metro-react-native-babel-preset'],
					},
				},
			},
		],
	},
	resolve: {
		extensions: ['.js', '.ts', '.json'],
	},
};

module.exports = config;
