const merge = require('webpack-merge');
const {spawn} = require('child_process');
const webConfigs = require('../web/webpack.config');

const config = merge(webConfigs, {
	target: 'electron-renderer',
	devServer: {
		open: false,
		setup: function() {
			spawn('electron', ['./desktop'], {shell: true, env: process.env, stdio: 'inherit'})
				.on('close', code => process.exit(0))
				.on('error', spawnError => console.error(spawnError));
		},
	},
});
console.log('config', config);
module.exports = config;
