const shell = require('shelljs');
try {
	if (shell.ls().some(item => item.includes('temp'))) {
		shell.rm('-rf', 'temp');
	}
	shell.mkdir('temp');
	shell.cp('-r', './web/build', './temp/');
	shell.rm('-rf', './desktop/dist');
	shell.cp('-r', './desktop/*', './temp/');
	shell.cp('package.json', './temp/');
	shell.mkdir('temp/node_modules');
	shell.cp('-r', './node_modules/electron*', './temp/node_modules');
	shell.cd('temp');
	shell.exec('electron-builder .');
	shell.cd('..');
	shell.rm('-rf', 'temp');
} catch (err) {
	console.log(err);
}
