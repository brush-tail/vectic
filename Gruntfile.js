'use strict';

module.exports = function (grunt) {

  // grunt.loadNpmTasks([
  //   'grunt-karma',
  //   'grunt-contrib-uglify',
  // ]);

  require('jit-grunt')(grunt, {
    uglify: 'grunt-contrib-uglify',
    karma: 'grunt-karma',
    watch: 'grunt-contrib-watch',
  });

  grunt.initConfig({
    watch: {
      scripts: {
        options: {
          spawn: false,
          reload: true,
        },
        files: [
          './Gruntfile.js',
          './index.js',
          './index.spec.js',
        ],
        tasks: [
          'uglify',
          'karma:unit',
          'karma:min',
        ],
      },
    },
    karma: {
      options: {
        configFile: 'karma.conf.js',
        autoWatch: false,
        singleRun: true,
      },
      unit: {
        files: [
          {src:'index.js'},
          {src:'*.spec.js'},
        ],
      },
      min: {
        files: [
          {src:'index.min.js'},
          {src:'*.spec.js'},
        ],
      },
    },
    uglify: {
      options: {
        // mangle: false,
        mangle: {
          except: ['firebase', '$']
        },
        compress: true,
        wrap: false,
        preserveComments: false,
      },
      default: {
        files: {
          'index.min.js':['index.js'],
        },
      }
    },
  });

  grunt.registerTask('test', [
    'uglify',
    'karma:unit',
    'watch',
  ]);
  // grunt.registerTask('test-min', [
  //   'karma:min',
  // ]);

  // /build/release
};