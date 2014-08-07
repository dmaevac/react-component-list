(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @jsx React.DOM */
var React = require('react');
var _ = require('lodash');
var Item = require('./item.react');

var resultCountStyle = { float: 'right', marginTop: '-20px', fontSize: '80%' };

function getfilter(query) {
  return function (p) {
    return query.length === 0 ||
      (!!~p.name.indexOf(query) ||
        !!~p.group.indexOf(query) ||
        !!~(p.keywords || []).join().indexOf(query));
  };
}

function getSort(field) {

  if (field === 'watchers') return function (a, b) {
    return b[field] - a[field]
  };

  return  function (a, b) {
    return new Date(b[field]).getTime() - new Date(a[field]).getTime();
  }

}

module.exports = React.createClass({displayName: 'exports',

  getInitialState: function () {
    return { query: null, sort: 'modified' };
  },

  handleChange: function (event) {
    this.setQuery(event.target.value);
  },

  setQuery: function (query) {
    this.setState({ query: query });
  },

  render: function () {
    var query = this.state.query === null ? this.props.query : this.state.query,
      sort = this.state.sort === null ? this.props.sort : this.state.sort;

    var items = _(this.props.data || [])
      .filter(getfilter(query))
      .sort(getSort(sort))
      .map(function (v, k) { return (Item( {key:k, proj:v} )); })
      .value();

    return !this.props.data
      ? (React.DOM.h2(null, "Loading..."))
      : (React.DOM.div(null, 
          React.DOM.input( {type:"text", className:"search", value:query, onChange:this.handleChange,
          placeholder:"Enter a keyword or project name..."} ),
     query ?
          React.DOM.div( {style:resultCountStyle}, items.length, " result(s)")
      : false, 
          React.DOM.ul(null, items)
        ))
  }

});
},{"./item.react":3,"lodash":"K2RcUv","react":"M6d2gk"}],2:[function(require,module,exports){
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

},{"./app.react":1,"react":"M6d2gk"}],3:[function(require,module,exports){
/** @jsx React.DOM */
var React = require('react');
var moment = require('moment');
var _ = require('lodash');
var Tag = require('./tag.react');

module.exports = React.createClass({

  displayName: 'Item',

  render: function () {
    var keywords = [this.props.proj.group].concat(this.props.proj.keywords || []),
      blacklist = ['react', 'react-component'];

    var tags = _(keywords)
      .filter(function (v) { return !~blacklist.indexOf(v); })
      .uniq()
      .map(function (v) { return (Tag( {key:v, name:v} )); })
      .value();

    return (React.DOM.li( {className:"project"}, 
      React.DOM.h3(null, 
        React.DOM.a( {href: this.props.proj.repo },  this.props.proj.name ),
          this.props.proj.demo ? React.DOM.small(null, " ",React.DOM.a( {target:"_blank", href:this.props.proj.demo}, "(DEMO)"))  : ''
      ),
      React.DOM.p(null,  this.props.proj.description 

      ),
      React.DOM.small( {className:""}, "Created ",  moment(this.props.proj.created).format("MMM Do YYYY"), ", "+' '+
      "modified ",  moment(this.props.proj.modified).fromNow(), ", ",
         this.props.proj.watchers,  " watchers"
      ),
      React.DOM.br(null),
          tags
    ));
  }

});

},{"./tag.react":4,"lodash":"K2RcUv","moment":"iROhDJ","react":"M6d2gk"}],4:[function(require,module,exports){
/** @jsx React.DOM */
var React = require('react');

module.exports = React.createClass({displayName: 'exports',

  render: function () {
    return (React.DOM.a( {className:"tag", href: '#' + this.props.name },  this.props.name ));
  }

});
},{"react":"M6d2gk"}]},{},[2])