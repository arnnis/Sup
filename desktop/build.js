const shell = require('shelljs');
const chalk = require('chalk').default;

try {
	// build electron-main js bundle
	shell.exec(
		'cross-env NODE_ENV=production webpack --config ./desktop/webpack.config.main.prod.js --color',
	);

	if (shell.ls().some(item => item.includes('temp'))) {
		console.log(chalk.bgYellow('Removing old temp folder'));
		shell.rm('-rf', 'temp');
	}

	console.log(chalk.bgCyan('Moving necessary files to temp folder...'));
	shell.mkdir('temp');
	shell.cp('-r', './web/build', './temp/www');
	console.log(chalk.bgYellow('Removing old dist folder if exists...'));
	shell.rm('-rf', './desktop/dist');
	shell.cp('-r', './desktop/build/*', './temp');
	shell.cp('-r', './desktop/resources', './temp');
	shell.cp('package.json', './temp/');
	shell.mkdir('temp/node_modules');
	shell.cp('-r', './node_modules/electron*', './temp/node_modules');
	shell.cd('temp');

	console.log(chalk.bgCyan('Starting desktop pack...'));
	shell.exec('electron-builder . -m');
	console.log(chalk.bgGreen('Desktop build done...'));

	console.log(chalk.bgYellow('Removing temp folder...'));
	shell.cd('..');
	shell.rm('-rf', 'temp');

	console.log(chalk.bgGreen('All done'));
} catch (err) {
	console.log(chalk.bgRed(err));
}
