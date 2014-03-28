/** @jsx React.DOM */
var React = require('react');

module.exports = React.createClass({

  render: function () {
    return (<a className="tag" href={ '#' + this.props.name }>{ this.props.name }</a>);
  }

});