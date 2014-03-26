/** @jsx React.DOM */
(function () {
  var Tag = React.createClass({
    render: function () {
      return <a className="tag" onClick={this.props.setQuery.bind(null, this.props.name)}>{ this.props.name }</a>
    }
  });

  var Item = React.createClass({
    displayName: 'Item',
    render: function () {
      var tags = [], _this = this;
      d3.map([this.props.proj.group].concat(this.props.proj.keywords||[])).forEach(function (k, v) {
        if (v !== 'react' && v !== 'react-component') {
          tags.push(<Tag setQuery={_this.props.setQuery} key={k} name={v} />);
        }
      });
      return <li className="project">
          <a href={ this.props.proj.repo }>{ this.props.proj.name }</a><br/>
          <i className="">{ this.props.proj.description }</i><br/>
          <small className="">created { moment(this.props.proj.created).format("MMM Do YY") },  modified { moment(this.props.proj.modified).fromNow() }</small><br/>
          {tags}
      </li>
    }
  });

  var Cats = React.createClass({
    displayName: 'List',
    getInitialState: function() {
      return { query: null };
    },
    handleChange: function(event) {
      this.setQuery(event.target.value);
    },
    setQuery: function (query) {
      this.setState({ query: query });
    },
    render: function () {
      var items = [], _this = this,
        query = this.state.query === null ? this.props.query : this.state.query,
      data = (this.props.data || []).filter(function (p) {
        return query.length === 0 || (!!~p.name.indexOf(query)
            || !!~p.group.indexOf(query)
            || !!~(p.keywords || []).join().indexOf(query));
      });
      d3.map(data).forEach(function (k,v) {
        items.push(<Item setQuery={_this.setQuery} key={k} proj={v} />)
      });
      var body = (<div><input type="text" className="search" value={query} onChange={this.handleChange}  placeholder="Enter a keyword or project name..." /><ul>{items}</ul></div>);
      var loading = <h2>Loading...</h2>;
      return this.props.data ? body : loading;
    }
  });

  var path = (window.document.location.hash || '').replace('#','');
  var App = React.renderComponent(<Cats query={path} />, document.getElementById('main_content'));

  d3.json('dist/list.json', function (data) {
    App.setProps({ data: data, query: path });
  });
}());