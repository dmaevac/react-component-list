
var
  path            = require('path'),
  reactify        = require('reactify'),
  jsRoot          = path.join(__dirname, 'dist'),
  appBundlePath   = path.join(jsRoot, 'app.js'),
  libsBundlePath  = path.join(jsRoot, 'libs.js'),
  dependencies    = require('./package.json').dependencies,
  external        = [];

for (var k in  dependencies) {
  if (dependencies.hasOwnProperty(k)) {
    external.push(k);
  }
}

module.exports = function (grunt) {

  grunt.initConfig({

    browserify: {

      libs: {
        src: [],
        dest: libsBundlePath,
        options: {
          require: external,
          transform: ['uglifyify']
        }
      },

      app: {
        src: ['./scripts/entry.js'],
        dest: appBundlePath,
        options: {
          external: external,
          transform: [reactify]
        }
      }

    },

    watch: {

      libs: {
        files: ['./Gruntfile.js', './node_modules/*'],
        tasks: ['browserify:libs'],
        options: {
          debounceDelay: 250
        }
      },

      app: {
        files: ['./Gruntfile.js', './*.html', './stylesheets/*.css', './scripts/**/*.js'],
        tasks: ['browserify:app'],
        options: {
          debounceDelay: 250,
          livereload: true
        }
      }

    }


  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.registerTask('default', ['browserify', 'watch']);

};