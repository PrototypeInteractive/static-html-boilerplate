module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: [
                    'assets/js/main.js'
                ],
                dest: 'build/js/main.js',
            }
        },


        uglify: {
            build: {
                src: 'build/js/main.js',
                dest: 'build/js/main.js'
            },
        },


        less: {
            development: {
                options: {
                    compress: false,
                    yuicompress: false,
                    optimization: 2,
                    relativeUrls: true,
                    cleancss: false
                },
                files: {
                    "build/css/main.css": "assets/css/main.less"
                }
            },
            production: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2,
                    relativeUrls: true,
                    cleancss: true
                },
                files: {
                    "build/css/main.css": "assets/css/main.less"
                }
            }
        },

        watch: {
            styles: {
                files: ['assets/css/*.less'],
                tasks: grunt.option('env') == "development" ? ['less:development'] : ['less:production'],
                options: {
                    nospawn: true
                }
            },
            scripts: {
                files: ['assets/js/*.js'],
                tasks: grunt.option('env') == "development" ? ['concat'] : ['concat', 'uglify'],
                options: {
                    spawn: false,
                }
            }
        }

    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    if (grunt.option('env') == "development") {
        grunt.registerTask('default', ['concat:dist', 'less:development', 'watch']);
    } else {
        grunt.registerTask('default', ['concat:dist', 'uglify:build', 'less:production', 'watch']);
    }
};
