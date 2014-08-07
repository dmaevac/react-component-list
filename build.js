var YAML = require('yamljs');
var fs = require('fs');
var url = require('url');
var RSVP = require('rsvp');
var path = require('path');
var request = require('request');
var auth = require('./auth.json');

var cats = YAML.load('./list.yaml');

if (!cats) {
  throw new Error("Error parsing yaml");
}

var promises = [], rawdomain = 'raw.github.com', plain = 'text/plain';
var GitHubApi = require("github");
var github = new GitHubApi({
  // required
  version: "3.0.0",
  // optional
  debug: true,
  protocol: "https",
  timeout: 5000
});

github.authenticate(auth);

function fetchGithubMeta(proj) {
  return new RSVP.Promise(function (resolve, reject) {
    var u;
    if ((u = url.parse(proj.repo))) {
      var parts = u.pathname.split('/');
      if (parts.length === 3) {
        console.log("Fetching github meta", parts[1], parts[2]);
        github.repos.get({
          user: parts[1],
          repo: parts[2]
        }, function (err, data) {
          if (!err) {
            proj.modified = data.pushed_at;
            proj.created = data.created_at;
            proj.watchers = data.watchers;
            resolve(proj);
          } else {
            reject(err);
          }
        });
      } else {
        reject("Unexpected repo url pattern");
      }
    } else {
      reject("Missing project repo");
    }
  });
}

function fetchPackageMeta(proj) {
  return new RSVP.Promise(function (resolve, reject) {
    var u, json, rej = reject.bind(null, proj);
    if ((u = url.parse(proj.repo))) {
      var pkgUrl = 'https://' + path.join(rawdomain, u.pathname, 'master', 'package.json');
      console.log("Fetching metadata", pkgUrl);
      request({
        strictSSL: false,
        method: 'GET',
        url: pkgUrl,
        headers: {
          'Accept': plain
        }
      }, function (err, resp, data) {
        var headers = resp && resp.headers;
        var ct = resp && headers && !!~headers['content-type'];
        if (!err) {
          try {
            if (data && (json = JSON.parse(data))) {
              proj.keywords = json.keywords || json.tags;
              resolve(proj);
            } else {
              resolve()
            }
          } catch (e) {
            resolve();
          }
        } else {
          resolve();
        }
      });
    } else {
      rej("Couldnt parse url");
    }
  });
}

for (var c in cats) {
  promises.push(fetchGithubMeta(cats[c]));
  promises.push(fetchPackageMeta(cats[c]));
}

RSVP.all(promises).then(function () {
  fs.writeFileSync('./dist/list.json', JSON.stringify(cats));
}).catch(function (reason) {
  fs.writeFileSync('./dist/list.json', JSON.stringify(cats));
  console.error(reason);
});