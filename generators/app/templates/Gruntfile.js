'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);
  // Load all tasks
  require('load-grunt-tasks')(grunt);

  var yoRc = require('./.yo-rc.json');

  // Configurable paths for the application
  var config = {
    template: yoRc['generator-angular-symfony'].templateFolder || '_template',
    sfViews: yoRc['generator-angular-symfony'].sfViews || 'app/Resources/views/',
    sfAssets: yoRc['generator-angular-symfony'].sfAssets || 'web/',
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    config: config,

    // Empties folders to start fresh
    clean: {
    },


    // Copies remaining files to places other tasks can use
    copy: {
      symfony: {
        files: [{
          expand: true,
          dot: false,
          cwd: '<%= config.template %>/dist',
          dest: '<%= config.sfAssets %>',
          src: ['images/**/*.*','styles/**/*.*','scripts/**/*.*','bower_components/**/*.*','common/**/*.*']
        },
        {
          expand: true,
          dot: false,
          cwd: '<%= config.template %>/dist',
          dest: '<%= config.sfViews %>',
          src: ['{,*/}*.html','views/{,*/}*.html'],
          rename: function(dest, src) {
            return dest + src.replace('.html','.html.twig');
          }
        }
      ]}
    }
  });

  grunt.registerTask('build', [
    'copy:symfony'
  ]);

};
