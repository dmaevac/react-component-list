/** @jsx React.DOM */
/*global d3,React,moment*/
(function () {

  var resultCountStyle = { float: 'right', marginTop: '-20px', fontSize: '90%' };

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


  var Tag = React.createClass({
    render: function () {
      return <a className="tag" onClick={this.props.setQuery.bind(null, this.props.name)}>{ this.props.name }</a>
    }
  });

  var Item = React.createClass({
    displayName: 'Item',
    render: function () {
      var tags = [], _this = this, keywords = [this.props.proj.group].concat(this.props.proj.keywords || []);
      d3.map(keywords).forEach(function (k, v) {
        if (v !== 'react' && v !== 'react-component') {
          tags.push(<Tag setQuery={_this.props.setQuery} key={k} name={v} />);
        }
      });
      return <li className="project">
        <h3><a href={ this.props.proj.repo }>{ this.props.proj.name }</a></h3>
        <p>{ this.props.proj.description }</p>
        <small className="">Created { moment(this.props.proj.created).format("MMM Do YYYY") },  modified { moment(this.props.proj.modified).fromNow() }, { this.props.proj.watchers } watchers</small><br/>
          {tags}
      </li>
    }
  });

  var Cats = React.createClass({
    displayName: 'List',
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
      var items = [], _this = this,
        query = this.state.query === null ? this.props.query : this.state.query,
        sort = this.state.sort === null ? this.props.sort : this.state.sort,
        data = (this.props.data || [])
                .filter(getfilter(query))
                .sort(getDateSort(sort));

      d3.map(data).forEach(function (k, v) {
        items.push(<Item setQuery={_this.setQuery} key={k} proj={v} />);
      });

      var body = (<div>
        <input type="text" className="search" value={query} onChange={this.handleChange}  placeholder="Enter a keyword or project name..." />
        <div style={resultCountStyle}>{items.length} result(s)</div>
        <ul>{items}</ul>
      </div>);
      var loading = <h2>Loading...</h2>;

      return this.props.data ? body : loading;
    }
  });

  var path = (window.document.location.hash || '').replace('#', '');
  var App = React.renderComponent(<Cats query={path} />, document.getElementById('main_content'));

  d3.json('dist/list.json', function (data) {
    App.setProps({ data: data, query: path });
  });
}());