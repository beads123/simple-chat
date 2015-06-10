'use strict';

var request = require('request');

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var reloadPort = 35729, files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'bin/www'
      }
    },
    clean:{
     dist:{
         src:['public/cssmin','public/jsmin','public/imgmin']
     }
    },
    uglify:{
       options: {
            mangle: false
       },
      jsmin:{
          files:[
              {
                  expand:true,
                  cwd:'public/js',
                  src:['*.js'],
                  dest:'public/jsmin/',
                  ext:'.js',
                  extDot:'first'
              }
          ]
      }
    },
    cssmin:{
        dist:{
            files:{
                'public/cssmin/style.css':['public/css/style.css']
            }
        }
    },
    replace:{
      dist:{
          src:'public/cssmin/style.css',
          dest:'public/cssmin/style.css',
          replacements:[
              {
                  from:'../img',
                  to:'../imgmin'
              }
          ]
      }
    },
    imagemin:{
     dist:{
         files:[
             {
                 expand:true,
                 cwd:'public/img',
                 src:['*.{jpg,png,gif}'],
                 dest:'public/imgmin/'
             }
         ]
     }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort
      },
      server: {
        files: [
          'bin/www',
          'app.js',
          'routes/*.js'
        ],
        tasks: ['develop', 'delayed-livereload']
      },
      js: {
        files: ['public/js/*.js'],
        options: {
          livereload: reloadPort
        }
      },
      css: {
        files: [
          'public/css/*.css'
        ],
        options: {
          livereload: reloadPort
        }
      },
      views: {
        files: ['views/*.jade'],
        options: {
          livereload: reloadPort
        }
      }
    }
  });

  grunt.config.requires('watch.server.files');
  files = grunt.config('watch.server.files');
  files = grunt.file.expand(files);

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function (err, res) {
          var reloaded = !err && res.statusCode === 200;
          if (reloaded) {
            grunt.log.ok('Delayed live reload successful.');
          } else {
            grunt.log.error('Unable to make a delayed live reload.');
          }
          done(reloaded);
        });
    }, 500);
  });

  grunt.registerTask('default', [
    'develop',
    'watch'
  ]);
  grunt.registerTask('build',[
      'clean',
      'uglify',
      'cssmin',
      'replace',
      'imagemin'
  ]);
};
