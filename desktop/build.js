const shell = require('shelljs');
const chalk = require('chalk').default;

try {
	if (shell.ls().some(item => item.includes('temp'))) {
		console.log(chalk.bgYellow('Removing old temp folder'));
		shell.rm('-rf', 'temp');
	}

	console.log(chalk.bgCyan('Moving necessary files to temp folder...'));
	shell.mkdir('temp');
	shell.cp('-r', './web/build', './temp/');
	console.log(chalk.bgYellow('Removing old dist folder if exists...'));
	shell.rm('-rf', './desktop/dist');
	shell.cp('-r', './desktop/*', './temp/');
	shell.cp('package.json', './temp/');
	shell.mkdir('temp/node_modules');
	shell.cp('-r', './node_modules/electron*', './temp/node_modules');
	shell.cd('temp');

	console.log(chalk.bgCyan('Starting desktop pack...'));
	shell.exec('electron-builder . -mwl');
	console.log(chalk.bgGreen('Desktop build done...'));

	console.log(chalk.bgYellow('Removing temp folder...'));
	shell.cd('..');
	shell.rm('-rf', 'temp');

	console.log(chalk.bgGreen('All done'));
} catch (err) {
	console.log(chalk.bgRed(err));
}
