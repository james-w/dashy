module.exports = function (grunt) {
    "use strict";
    var SRC = 'src';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            build: [
                'static/src', 
                'static/js',
                'static/css'
            ]
        },

        cssmin: {
            screen: {
                files: {
                    'static/css/dashy-min.css': [
                        SRC + '/css/*.css',
                    ]
                }
            }
        },

        jshint: {
          source: {
            options: {
                jshintrc: true
            },
            files: {'src': [
                '.jshintrc',
                'Gruntfile.js',
                SRC + '/js/*.js'
            ]}
          },
          jsx: {
            options: {
                jshintrc: true
            },
            files: {'src': [
                'static/' + SRC + '/js/*.js'
            ]}
          }
        },

        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        src: [SRC + '/**/*'],
                        dest: 'static/'
                    }
                ]
            }
        },

        react: {
            files: {
                expand: true,
                cwd: SRC + '/jsx/',
                src: ['*.jsx'],
                dest: 'static/src/js/',
                ext: '.js'
            }
        },

        uglify: {
            options: {
                sourceMap: true
            },
            prod: {
                files: {
                    'static/js/dashy-min.js': [ 'static/src/js/*.js' ]
                }
            }
        },

        concat: {
            options: {
                sourceMap: true
            },
            devel: {
                files: {
                    'static/js/dashy.js': [ 'static/src/js/*.js' ]
                }
            }
        },

        watch: {
            all: {
                files: ['.jshintrc', 'Gruntfile.js', SRC + 'js/*.js', SRC + '/**/*.js', SRC + '/**/*.css', SRC + '/**/*.html', SRC + '/**/*.jsx'],
                tasks: ['test', 'clean:build', 'minify']
            },
            notest: {
                files: ['Gruntfile.js', SRC + '/**/*.js', SRC + '/**/*.css', SRC + '/**/*.html', SRC + '/**/*.jsx'],
                tasks: ['lint', 'clean:build', 'minify']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-react');

    grunt.registerTask('default', ['watch:all']);

    grunt.registerTask('lint', ['jshint:source']);
    grunt.registerTask('test', ['lint']);
    grunt.registerTask('minify', ['copy', 'react', 'jshint:jsx', 'uglify', 'concat', 'cssmin']);
    grunt.registerTask('build', ['clean:build', 'minify']);


};
