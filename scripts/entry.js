var React = require('react');
var App = require('./app.react');

function getHash() {
  return (window.document.location.hash || '').replace('#', '');
}

var app = React.renderComponent(App({query: getHash()}), document.getElementById('main_content'));

window.addEventListener('hashchange', function (hash) {
  app.setProps({ query: getHash() });
});

var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function (ev) {
  if (xhr.readyState === 4) {
    var data = JSON.parse(ev.target.response);
    app.setProps({ data: data, query: getHash() });
  }
};

xhr.open("GET", 'dist/list.json', true);
xhr.send(null);
