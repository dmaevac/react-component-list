var YAML = require('yamljs');
var fs = require('fs');
var path = require('path');
var url = require('url');
var request = require('request');
var RSVP = require('rsvp');

var cats = YAML.load('./list.yaml');

if (!cats) {
  throw new Error("Error parsing yaml");
}

var promises = [], inc = 1000;
var GitHubApi = require("github");
var github = new GitHubApi({
  // required
  version: "3.0.0",
  // optional
  debug: true,
  protocol: "https",
  timeout: 5000
});

function fetch(proj) {
  return new RSVP.Promise(function (resolve, reject) {
    var u;
    if ((u = url.parse(proj.repo))) {
      var parts = u.pathname.split('/');
      github.repos.get({
        user: parts[1],
        repo: parts[2]
      }, function (err, data) {
        if (!err) {
          proj.repo.modified = data.pushed_at;
          proj.repo.watchers = data.watchers;
          resolve(proj);
        } else {
          reject(err);
        }
      });
    }
  });
}

for (var c in cats) {
  for (var p in cats[c]) {
    setTimeout(function() {
      promises.push(fetch(this));
    }.bind(cats[c][p]), inc);
    inc += 1000;
  }
}

RSVP.all(promises, function () {
  fs.writeFileSync('./dist/list.json', JSON.stringify(cats));
}).catch(function(reason){
  console.error(reason);
});