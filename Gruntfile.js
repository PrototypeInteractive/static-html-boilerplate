module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: [
                    'assets/lib/jquery/dist/jquery.min.js',
                    'assets/js/main.js'
                ],
                dest: 'build/js/scripts.js',
            }
        },


        uglify: {
            build: {
                src: 'build/js/scripts.js',
                dest: 'build/js/scripts.min.js'
            },
        },




        sass: {
            dist: {
                options: {
                    loadPath: './',
                    compass: true,
                    sourcemap: 'none',
                    style: 'compressed'
                },
                files: {
                    'build/css/style.css': 'assets/sass/style.scss'
                }
            }
        },


        watch: {
            styles: {
                files: ['assets/sass/*.scss'],
                tasks: ['sass'],
                options: {
                    nospawn: true
                }
            },
            scripts: {
                files: ['assets/js/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false,
                }
            }
        },

        browserSync: {
            bsFiles: {
                src: 'build/css/*.css'
            },
            options: {
                server: {
                    baseDir: "./"
                },
                watchTask: true,
                //proxy: "localhost:90"
            }
        },

    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');
    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.

    grunt.registerTask('default', ['concat', 'uglify', 'sass', 'browserSync', 'watch']);

};
