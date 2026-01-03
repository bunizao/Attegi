module.exports = function(grunt) {
  'use strict';
  const sass = require('sass');
  require('load-grunt-tasks')(grunt, {
    pattern: ['grunt-*']
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    config: {
      'cssSrcDir': 'src/sass',
      'cssTargetDir': 'assets/css',
      'jsSrcDir': 'src/js',
      'jsTargetDir': 'assets/js',
      'jsDependencies': []
    },
    copy: {
      dev: {
        files: [{
          dest: 'assets/font/',
          src: '*',
          cwd: 'src/font/',
          expand: true
        }, {
          dest: 'assets/js/highlight.pack.js',
          src: 'src/js/libs/highlight.pack.js'
        }, {
          dest: 'assets/js/glightbox.min.js',
          src: 'src/js/libs/glightbox.min.js'
        }, {
          dest: 'assets/css/glightbox.min.css',
          src: 'src/sass/glightbox.min.css'
        }]
      },
      dist: {
        files: [{
          dest: 'assets/font/',
          src: '*',
          cwd: 'src/font/',
          expand: true
        }, {
          dest: 'assets/js/highlight.pack.js',
          src: 'src/js/libs/highlight.pack.js'
        }, {
          dest: 'assets/js/glightbox.min.js',
          src: 'src/js/libs/glightbox.min.js'
        }, {
          dest: 'assets/css/glightbox.min.css',
          src: 'src/sass/glightbox.min.css'
        }]
      }
    },
    clean: {
      dev: ['dev'],
      dist: ['dist'],
      all: ['dev', 'dist']
    },
    sass: {
      dev: {
        options: {
          implementation: sass,
          includePaths: ['<%= config.cssSrcDir %>'],
          sourceMaps: true
        },
        files: {
          '<%= config.cssTargetDir %>/style.css': '<%= config.cssSrcDir %>/style.scss'
        }
      },
      dist: {
        options: {
          implementation: sass,
          outputStyle: 'compressed'
        },
        files: {
          '<%= config.cssTargetDir %>/style.css': '<%= config.cssSrcDir %>/style.scss'
        }
      }
    },
    cssmin: {
      dist: {
        options: {
          level: 2,
          specialComments: 0
        },
        files: {
          '<%= config.cssTargetDir %>/style.css': '<%= config.cssTargetDir %>/style.css'
        }
      }
    },
    uglify: {
      main: {
        files: {
          '<%= config.jsTargetDir %>/script.js': [
            '<%= config.jsSrcDir %>/script.js'
          ]
        }
      },
      post: {
        files: {
          '<%= config.jsTargetDir %>/post.js': [
            '<%= config.jsSrcDir %>/post.js'
          ]
        }
      },
      toc: {
        files: {
          '<%= config.jsTargetDir %>/toc.js': [
            '<%= config.jsSrcDir %>/toc.js'
          ]
        }
      }
    },
    watch: {
      css: {
        files: '<%=  config.cssSrcDir %>/**/*.scss',
        tasks: ['sass:dev', 'copy:dev']
      },
      js: {
        files: '<%=  config.jsSrcDir %>/**/*.js',
        tasks: ['uglify:main', 'uglify:post', 'uglify:toc']
      }
    },
    compress: {
      main: {
        options: {
          archive: `dist/${require('./package.json').name}.zip`,
          level: 9
        },
        files: [{
          src: [
            '**',
            '!node_modules',
            '!node_modules/**',
            '!src',
            '!src/**',
            '!dist',
            '!dist/**',
            '!screenshots',
            '!screenshots/**',
            '!.git',
            '!.git/**',
            '!.github',
            '!.github/**',
            '!.gitignore',
            '!.gitattributes',
            '!Gruntfile.js',
            '!package-lock.json',
            '!docker-compose.yml',
            '!AGENTS.md',
            '!README_zh.md',
            '!.DS_Store',
            '!.lighthouseci',
            '!.playwright-mcp'
          ],
          dest: '.'
        }]
      },
    }
  });

  grunt.registerTask('build', [
    'sass:dist',
    'cssmin:dist',
    'copy:dist',
    'uglify:main',
    'uglify:post',
    'uglify:toc'
  ]);
  grunt.registerTask('default', [
    'sass:dev',
    'copy:dev',
    'uglify:main',
    'uglify:post',
    'uglify:toc',
    'watch'
  ]);
};
