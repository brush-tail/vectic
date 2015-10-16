'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        autoWatch: true,
        singleRun: false,
      }
    },
  });

  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('test', [
    'karma',
  ]);

  // /build/release
};