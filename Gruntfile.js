module.exports = function (grunt) {
    "use strict";
    var SRC = 'static/src';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            build: [
                SRC + '/jsx/built/', 
                'static/js',
                'static/css'
            ]
        },

        cssmin: {
            screen: {
                files: {
                    'static/css/dashy-min.css': [
                        SRC + '/css/dashy.css',
                    ]
                }
            }
        },

        jshint: {
            options: {
                jshintrc: true
            },
            unminified: [
                '.jshintrc',
                'Gruntfile.js',
                SRC + '/js/*.js'
            ]
        },

        react: {
            files: {
                expand: true,
                cwd: SRC + '/jsx/',
                src: ['*.jsx'],
                dest: SRC + '/jsx/built/',
                ext: '.js'
            }
        },

        uglify: {
            options: {
                sourceMap: true
            },
            prod: {
                files: {
                    'static/js/dashy-min.js': [ SRC + '/js/*.js', SRC + '/jsx/built/*.js' ]
                }
            }
        },

        watch: {
            all: {
                files: ['.jshintrc', 'Gruntfile.js', SRC + '/**/*.js', SRC + '/**/*.css', SRC + '/**/*.html', SRC + '/**/*.jsx'],
                tasks: ['test', 'clean:build', 'react', 'minify']
            },
            notest: {
                files: ['Gruntfile.js', SRC + '/**/*.js', SRC + '/**/*.css', SRC + '/**/*.html', SRC + '/**/*.jsx'],
                tasks: ['lint', 'clean:build', 'react', 'minify']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-react');

    grunt.registerTask('default', ['watch:all']);

    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('test', ['lint']);
    grunt.registerTask('minify', ['uglify', 'cssmin']);
    grunt.registerTask('build', ['clean:build', 'react', 'minify']);


};
