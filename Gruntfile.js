// Generated on 2014-12-10 using generator-backbone-amd 0.0.4
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        less: {
            dist: {
                files: {
                    './app/styles/main.css' : './app/styles/main.less'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
};
