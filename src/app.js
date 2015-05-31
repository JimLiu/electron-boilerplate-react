require.main.paths.splice(0, 0, process.env.NODE_PATH);
var remote = require('remote'),
    Menu = remote.require('menu'),
    React = require('react'),
    Router = require('react-router'),
    ipc = require('ipc'),
    routerContainer = require('./router'),
    routes = require('./routes'),
    template = require('./menutemplate'),
    webUtil = require('./utils/WebUtil'),
    metrics = require('./utils/MetricsUtil');



webUtil.addWindowSizeSaving();
webUtil.addLiveReload();
webUtil.addBugReporting();
webUtil.disableGlobalBackspace();

Menu.setApplicationMenu(Menu.buildFromTemplate(template()));

metrics.track('Started App');
metrics.track('app heartbeat');
setInterval(function () {
  metrics.track('app heartbeat');
}, 14400000);

var router = Router.create({
  routes: routes
});
router.run(Handler => React.render(<Handler/>, document.body));
routerContainer.set(router);


ipc.on('application:quitting', function () {
  //
});


module.exports = {
  router: router
};