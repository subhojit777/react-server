var React = require('react'),
  App = React.createFactory(require('./App'))
React.render(App(window.APP_PROPS), document.getElementById('content'))
