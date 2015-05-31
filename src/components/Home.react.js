var React = require('react/addons'),
    Router = require('react-router');

var Home = React.createClass({
  mixins: [Router.Navigation],
  handleGoBackClick: function () {
    this.goBack();
  },
  render: function () {
    return (
      <div className="home">
        <div className="home-content">
          <div className="title">Home</div>
        </div>
      </div>
    );
  }
});

module.exports = Home;
