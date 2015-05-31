var assign = require('object-assign'),
    Mixpanel = require('mixpanel'),
    uuid = require('node-uuid'),
    util = require('./Util'),
    settings = require('../settings');

var token = process.env.NODE_ENV === 'development' ? settings['mixpanel-dev'] : settings.mixpanel;
if (!token) {
  token = 'none';
}

var mixpanel = Mixpanel.init(token);

if (localStorage.getItem('metrics.enabled') === null) {
  localStorage.setItem('metrics.enabled', true);
}

var Metrics = {
  enabled: function () {
    return localStorage.getItem('metrics.enabled') === 'true';
  },
  setEnabled: function (enabled) {
    localStorage.setItem('metrics.enabled', !!enabled);
  },
  track: function (name, data) {
    data = data || {};
    if (!name) {
      return;
    }

    if (localStorage.getItem('metrics.enabled') !== 'true') {
      return;
    }

    var id = localStorage.getItem('metrics.id');
    if (!id) {
      localStorage.setItem('metrics.id', uuid.v4());
    }

    var os;

    if(util.isWindows()) {
      os = navigator.userAgent;
    } else {
      os = navigator.userAgent.match(/Mac OS X (\d+_\d+_\d+)/)[1].replace(/_/g, '.');
    }

    mixpanel.track(name, assign({
      distinct_id: id,
      version: util.packagejson().version,
      'Operating System Version': os,
      beta: !!settings.beta
    }, data));
  },

};
module.exports = Metrics;
