/** @jsx React.DOM */

var Tag = React.createClass({
  render: function () {
    return <a className="tag" onClick={this.props.setQuery.bind(null, this.props.name)}>{ this.props.name }</a>
  }
});

var Item = React.createClass({
  displayName: 'Item',
  render: function () {
    var tags = [], _this = this;
    d3.map(this.props.proj.keywords).forEach(function (k, v) {
      if (v !== 'react' && v !== 'react-component') {
        tags.push(<Tag setQuery={_this.props.setQuery} key={k} name={v} />);
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
    var items = [], query = this.props.query,
    _this = this,
    data = this.props.projects.filter(function (p) {
      return !!~p.name.indexOf(query) || !!~(p.keywords || []).join().indexOf(query);
    });
    d3.map(data).forEach(function (k,v) {
      items.push(<Item setQuery={_this.props.setQuery} key={k} proj={v} />)
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
    this.setQuery(event.target.value);
  },
  setQuery: function (query) {
    this.setState({value: query});
  },
  render: function () {
    var lists = [], _this = this, value = this.state.value;
    d3.map(this.props.data).forEach(function (k, v) {
      lists.push(<li key={k}><h3>{k}</h3><List setQuery={_this.setQuery} query={value} projects={v} /></li>)
    });
    var body = (<div><input type="text" className="search" value={value} onChange={this.handleChange}  placeholder="Enter a keyword or project name..." /><ul>{lists}</ul></div>);
    var loading = <h2>Loading...</h2>;
    return this.props.data ? body : loading;
  }
});

var App = React.renderComponent(<Cats/>, document.getElementById('main_content'));


d3.json('dist/list.json', function (data) {
  App.setProps({ data: data });
});

