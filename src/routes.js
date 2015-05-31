var React = require('react/addons'),
    Router = require('react-router'),
    Main = require('./components/Main.react'),
    Home = require('./components/Home.react'),
    About = require('./components/About.react'),
    Preferences = require('./components/Preferences.react'),

    Route = Router.Route,
    DefaultRoute = Router.DefaultRoute,
    RouteHandler = Router.RouteHandler,

    App = React.createClass({
      render: function () {
        return (
          <RouteHandler/>
        );
      }
    });

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="Main" path="/" handler={Main}>
      <DefaultRoute name="home" handler={Home} />
      <Route name="about" path="/about" handler={About} />
      <Route name="preferences" path="/preferences" handler={Preferences}/>
    </Route>
  </Route>
);

module.exports = routes;