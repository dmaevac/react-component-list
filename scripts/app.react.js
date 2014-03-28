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

function getDateSort(field) {
  return function (a, b) {
    return new Date(b[field]).getTime() - new Date(a[field]).getTime();
  };
}

module.exports = React.createClass({

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
      .sort(getDateSort(sort))
      .map(function (v, k) { return (<Item key={k} proj={v} />); })
      .value();

    return !this.props.data
      ? (<h2>Loading...</h2>)
      : (<div>
          <input type="text" className="search" value={query} onChange={this.handleChange}
          placeholder="Enter a keyword or project name..." />
    { query ?
          <div style={resultCountStyle}>{items.length} result(s)</div>
      : false }
          <ul>{items}</ul>
        </div>)
  }

});