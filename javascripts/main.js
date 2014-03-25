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
        tags.push(<Tag key={k} name={v} />);
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
    var items = [], query = this.props.query, data = this.props.projects.filter(function (p) {
      return !!~p.name.indexOf(query) || !!~(p.keywords || []).join().indexOf(query);
    });
    d3.map(data).forEach(function (k,v) {
      items.push(<Item key={k} proj={v} />)
    });
    return (<ul>{items}</ul>);
  }
});

var Cats = React.createClass({
  displayName: 'List',
  getInitialState: function() {
    return {value: ''};
  },
  handleChange: function(event) {
    this.setState({value: event.target.value});
  },
  render: function () {
    var lists = [], value = this.state.value;
    d3.map(this.props.data).forEach(function (k, v) {
      lists.push(<li key={k}><h3>{k}</h3><List query={value} projects={v} /></li>)
    });
    return (<div><input type="text" className="search" value={value} onChange={this.handleChange}  placeholder="Enter a keyword or project name..." /><ul>{lists}</ul></div>);
  }
});

var App = React.renderComponent(<Cats/>, document.getElementById('main_content'));


d3.json('dist/list.json', function (data) {
  App.setProps({ data: data });
});

