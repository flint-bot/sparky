module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    browserify: {
      sparky: {
        src: ['index.js'],
        dest: 'browser/node-sparky.js',
        options: {
          browserifyOptions: { standalone: 'Sparky' }
        }
      }
    },
    babel: {
      options: {
        presets: ['es2015']
      },
      sparky: {
        files: {
          'browser/node-sparky.js': 'browser/node-sparky.js'
        }
      }
    },
    uglify: {
      sparky: {
        files: {
          'browser/node-sparky.min.js': ['browser/node-sparky.js']
        }
      }
    }
  });

  grunt.registerTask('default', ['browserify', 'babel', 'uglify']);
};
