var React = require('react');
var d3 = require('d3');
var App = require('./app.react');

function getHash() {
    return (window.document.location.hash || '').replace('#', '');
}

var app = React.renderComponent(App({query: getHash()}), document.getElementById('main_content'));

window.addEventListener('hashchange', function (hash) {
    app.setProps({ query: getHash() });
});

d3.json('dist/list.json', function (data) {
    app.setProps({ data: data, query: getHash() });
});
