/** @jsx React.DOM */
var React = require('react');
var d3 = require('d3');
var Item = require('./item.react');

var resultCountStyle = { float: 'right', marginTop: '-20px', fontSize: '80%' };

function getfilter(query) {
  return function (p) {
    return query.length === 0 || (!!~p.name.indexOf(query)
      || !!~p.group.indexOf(query)
      || !!~(p.keywords || []).join().indexOf(query));
  }
}

function getDateSort(field) {
  return function (a, b) {
    return new Date(b[field]).getTime() - new Date(a[field]).getTime();
  }
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
    var items = [],
      query = this.state.query === null ? this.props.query : this.state.query,
      sort = this.state.sort === null ? this.props.sort : this.state.sort,
      data = (this.props.data || [])
        .filter(getfilter(query))
        .sort(getDateSort(sort));

    d3.map(data).forEach(function (k, v) {
      items.push(<Item key={k} proj={v} />);
    });

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