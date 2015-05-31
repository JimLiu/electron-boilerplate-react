var app = require('app'),
    autoUpdater = require('auto-updater'),
    BrowserWindow = require('browser-window'),
    fs = require('fs'),
    ipc = require('ipc'),
    path = require('path'),
    settings = require('./settings');

process.env.NODE_PATH = path.join(__dirname, '/../node_modules');
process.env.RESOURCES_PATH = path.join(__dirname, '/../resources');
process.chdir(path.join(__dirname, '..'));
process.env.PATH = '/usr/local/bin:' + process.env.PATH;

var size = {};

try {
  size = JSON.parse(
    fs.readFileSync(
      path.join(
        process.env[
          (process.platform === 'win32') ? 'USERPROFILE' : 'HOME'], 
          'Library', 
          'Application\ Support', 
          settings.app.name, 
          'size'
    )));
} catch (err) {}

var openURL = null;
app.on('open-url', function (event, url) {
  event.preventDefault();
  openURL = url;
});


app.on('ready', function () {
  var mainWindow = new BrowserWindow({
    width: size.width || 1000,
    height: size.height || 780,
    'min-width': 1000,
    'min-height': 600,
    'standard-window': false,
    resizable: true,
    frame: false,
    show: false,
  });

  mainWindow.loadUrl(path.normalize('file://' + path.join(__dirname, '..', 'build/index.html')));

  app.on('activate-with-no-open-windows', function () {
    if (mainWindow) {
      mainWindow.show();
    }
    return false;
  });

  var updating = false;
  ipc.on('application:quit-install', function () {
    updating = true;
    autoUpdater.quitAndInstall();
  });

  app.on('before-quit', function () {
    if (!updating) {
      mainWindow.webContents.send('application:quitting');
    }
  });

  mainWindow.webContents.on('new-window', function (e) {
    e.preventDefault();
  });

  mainWindow.webContents.on('will-navigate', function (e, url) {
    if (url.indexOf('build/index.html#') < 0) {
      e.preventDefault();
    }
  });

  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.setTitle(settings.title);
    mainWindow.show();
    mainWindow.focus();

    if (openURL) {
      mainWindow.webContents.send('application:open-url', {
        url: openURL
      });
    }
    app.on('open-url', function (event, url) {
      event.preventDefault();
      mainWindow.webContents.send('application:open-url', {
        url: url
      });
    });

    if (process.env.NODE_ENV !== 'development' && settings.autoUpdater.enabled) {
      var feedUrl = settings.feedUrl.replace('[version]', app.getVersion()).replace('[beta]', !!settings.beta);
      autoUpdater.setFeedUrl(feedUrl);
    }
  });

  autoUpdater.on('checking-for-update', function () {
    console.log('Checking for update...');
  });

  autoUpdater.on('update-available', function () {
    console.log('Update available.');
  });

  autoUpdater.on('update-not-available', function () {
    console.log('Update not available.');
  });

  autoUpdater.on('update-downloaded', function (e, releaseNotes, releaseName, releaseDate, updateURL) {
    console.log('Update downloaded.');
    console.log(releaseNotes, releaseName, releaseDate, updateURL);
    mainWindow.webContents.send('application:update-available');
  });

  autoUpdater.on('error', function (e, error) {
    console.log('An error occured while checking for updates.');
    console.log(error);
  });
});