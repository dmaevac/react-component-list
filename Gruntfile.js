var
  path = require('path'),
  reactify = require('reactify'),
  distRoot = path.join(__dirname, 'dist'),
  srcRoot = path.join(__dirname, 'scripts'),
  appBundlePath = path.join(distRoot, 'app.js'),
  libsBundlePath = path.join(distRoot, 'libs.js'),
  dependencies = require('./package.json').dependencies,
  external = [];

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
        src: [srcRoot + '/entry.js'],
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
        files: ['./Gruntfile.js', './*.html', './stylesheets/*.css', srcRoot + '/**/*.js'],
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
  grunt.registerTask('build', ['browserify']);
  grunt.registerTask('default', ['build']);

};