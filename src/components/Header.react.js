var React = require('react/addons'),
    remote = require('remote'),
    RetinaImage = require('react-retina-image'),
    ipc = require('ipc'),
    autoUpdater = remote.require('auto-updater'),
    Menu = remote.require('menu'),
    MenuItem = remote.require('menu-item'),
    Router = require('react-router'),
    classNames = require('classNames'),
    metrics = require('../utils/MetricsUtil');

var Header = React.createClass({
  mixins: [Router.Navigation],
  getInitialState: function () {
    return {
      fullscreen: false,
      updateAvailable: false
    };
  },
  componentDidMount: function () {
    document.addEventListener('keyup', this.handleDocumentKeyUp, false);

    ipc.on('application:update-available', () => {
      this.setState({
        updateAvailable: true
      });
    });
    autoUpdater.checkForUpdates();
  },
  componentWillUnmount: function () {
    document.removeEventListener('keyup', this.handleDocumentKeyUp, false);
  },
  handleDocumentKeyUp: function (e) {
    if (e.keyCode === 27 && remote.getCurrentWindow().isFullScreen()) {
      remote.getCurrentWindow().setFullScreen(false);
      this.forceUpdate();
    }
  },
  handleClose: function () {
    remote.getCurrentWindow().hide();
  },
  handleMinimize: function () {
    remote.getCurrentWindow().minimize();
  },
  handleFullscreen: function () {
    remote.getCurrentWindow().setFullScreen(!remote.getCurrentWindow().isFullScreen());
    this.setState({
      fullscreen: remote.getCurrentWindow().isFullScreen()
    });
  },
  handleAutoUpdateClick: function () {
    metrics.track('Restarted to Update');
    ipc.send('application:quit-install');
  },
  render: function () {
    let updateWidget = this.state.updateAvailable && !this.props.hideLogin ? <a className="btn btn-action small no-drag" onClick={this.handleAutoUpdateClick}>UPDATE NOW</a> : null;
    let buttons;
    if (this.state.fullscreen) {
      buttons = (
        <div className="buttons">
          <div className="button button-close disabled"></div>
          <div className="button button-minimize disabled"></div>
          <div className="button button-fullscreenclose enabled" onClick={this.handleFullscreen}></div>
        </div>
      );
    } else {
      buttons = (
        <div className="buttons">
          <div className="button button-close enabled" onClick={this.handleClose}></div>
          <div className="button button-minimize enabled" onClick={this.handleMinimize}></div>
          <div className="button button-fullscreen enabled" onClick={this.handleFullscreen}></div>
        </div>
      );
    }

    let headerClasses = classNames({
      bordered: !this.props.hideLogin,
      header: true,
      'no-drag': true
    });

    return (
      <div className={headerClasses}>
        {buttons}
        <div className="updates">
          {updateWidget}
        </div>
      </div>
    );
  }
});

module.exports = Header;
