const path = require('path');
const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const {is} = require('electron-util');
const unhandled = require('electron-unhandled');
const debug = require('electron-debug');
const contextMenu = require('electron-context-menu');
const electronDL = require('electron-dl');
const menu = require('./menu');

electronDL();
unhandled();
debug();
contextMenu();

// Note: Must match `build.appId` in package.json
app.setAppUserModelId('com.arnnis.sup');

// Prevent window from being garbage collected
let mainWindow;

const createMainWindow = async () => {
	const win = new BrowserWindow({
		title: app.getName(),
		show: false,
		width: 1280,
		height: 720,
		webPreferences: {
			devTools: is.development,
			nodeIntegration: true,
		},
	});

	win.on('ready-to-show', () => {
		win.show();
	});

	win.on('closed', () => {
		// Dereference the window
		// For multiple windows store them in an array
		mainWindow = undefined;
	});

	if (is.development) {
		await win.loadURL('http://localhost:8080/index.html');
	} else {
		await win.loadFile('./www/index.html');
	}

	return win;
};

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
	app.quit();
}

app.on('second-instance', () => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}

		mainWindow.show();
	}
});

app.on('window-all-closed', () => {
	if (!is.macos) {
		app.quit();
	}
});

app.on('activate', async () => {
	if (!mainWindow) {
		mainWindow = await createMainWindow();
	}
	ipcMain.on('resize-main-window', ({width, height}) => {
		let [currentWidth, currentHeight] = mainWindow.getSize();
		console.log('dsd', res);
		if (currentWidth < 1280) {
			mainWindow.setSize(width, currentHeight);
		}
	});
});

(async () => {
	await app.whenReady();
	Menu.setApplicationMenu(menu);
	mainWindow = await createMainWindow();
})();
