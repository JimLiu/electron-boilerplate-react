var React = require('react/addons'),
    Router = require('react-router');

var About = React.createClass({
  mixins: [Router.Navigation],
  handleGoBackClick: function () {
    this.goBack();
  },
  render: function () {
    return (
      <div className="about">
        <div className="about-content">
          <div className="title">About</div>
        </div>
      </div>
    );
  }
});

module.exports = About;
