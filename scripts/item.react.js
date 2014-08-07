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
      .map(function (v) { return (<Tag key={v} name={v} />); })
      .value();

    return (<li className="project">
      <h3>
        <a href={ this.props.proj.repo }>{ this.props.proj.name }</a>
          {this.props.proj.demo ? <small>&nbsp;<a target="_blank" href={this.props.proj.demo}>(DEMO)</a></small>  : ''}
      </h3>
      <p>{ this.props.proj.description }

      </p>
      <small className="">Created { moment(this.props.proj.created).format("MMM Do YYYY") },&nbsp;
      modified { moment(this.props.proj.modified).fromNow() },&nbsp;
        { this.props.proj.watchers } watchers
      </small>
      <br/>
          {tags}
    </li>);
  }

});
