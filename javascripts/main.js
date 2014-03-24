/** @jsx React.DOM */

var Tag = React.createClass({
  render: function () {
    return <span className="tag">{ this.props.name }</span>
  }
});

var Item = React.createClass({
  displayName: 'Item',
  render: function () {
    var tags = [];
    d3.map(this.props.proj.keywords).forEach(function (k, v) {
      if (v !== 'react' && v !== 'react-component') {
        tags.push(<Tag name={v} />);
      }
    });
    return <li className="project">
        <a href={ this.props.proj.repo }>{ this.props.proj.name }</a><br/>
        <i className="">{ this.props.proj.description }</i><br/>
        <small className="">{ this.props.proj.modified }</small><br/>
        {tags}
    </li>
  }
});

var List = React.createClass({
  displayName: 'List',
  render: function () {
    var items = [];
    d3.map(this.props.projects).forEach(function (k,v) {
      items.push(<Item key={k} proj={v} />)
    });
    return (<ul>{items}</ul>);
  }
});

var Cats = React.createClass({
  displayName: 'List',
  render: function () {
    var lists = [];
    d3.map(this.props.data).forEach(function (k, v) {
      lists.push(<li key={k}><h3>{k}</h3><List projects={v} /></li>)
    });
    return (<ul>{lists}</ul>);
  }
});

var App = React.renderComponent(<Cats/>, document.getElementById('main_content'));


d3.json('dist/list.json', function (data) {
  App.setProps({ data: data });
});

