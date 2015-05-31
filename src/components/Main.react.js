var React = require('react'),
    Header = require('./Header.react');

var Main = React.createClass({
  render() {
    return (
      <div className="main-container">
        <Header />
        <div className="main-container-body">
          <Router.RouteHandler />
        </div>
      </div>
    );
  }
});

module.exports = Main;