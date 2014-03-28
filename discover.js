var npm = require('npm');
var YAML = require('yamljs');
var cats = YAML.load('./list.yaml');

if (!cats) {
  throw new Error("Error parsing yaml");
}

var lookup = cats.reduce(function (m, o) { m[o.name] = o; return m;  }, {});

npm.load({}, function () {
  npm.commands.search(['reactjs'], true, (1000 * 60 * 60 * 24 * 365), function (err, packages){
    var added = 0;

    for(var k in  packages) {
      if (!(k in lookup)) {
       console.log(k);
      }
    }

  });
});
