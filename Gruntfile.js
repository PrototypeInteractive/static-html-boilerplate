module.exports = function(grunt) {

    // 1. All configuration goes here 

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: [
                    'assets/js/main.js'
                ],
                dest: 'dist/build/js/scripts.js',
            }
        },


        uglify: {
            build: {
                src: 'dist/build/js/scripts.js',
                dest: 'dist/build/js/scripts.min.js'
            },
        },


        sass: {
            options: {
                sourceMap: true,
                outputStyle: 'compressed'
            },
            dist: {
                files: {
                    'dist/build/css/style-rtl.css': 'assets/sass/style-rtl.scss',
                    'dist/build/css/style-ltr.css': 'assets/sass/style-ltr.scss'
                }
            }
        },

        notify: {
            sass: {
                options: {
                    title: 'SASS Compiled Successfuly',
                    message: 'SASS finished ',
                    duration: 0.5
                }
            },
            bake: {
                options: {
                    title: 'HTML Built',
                    message: 'HTML Built Successfuly',
                    duration: 0.5
                }
            }
        },

        watch: {
            html: {
                files: ['**/source/**/*.html', '**/partials/**/*.html'],
                tasks: ['bake:dist', 'notify:bake'],
                options: {
                    nospawn: true
                }
            },
            styles: {
                files: ['assets/sass/*.scss'],
                tasks: ['sass', 'notify:sass'],
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
                src: ['dist/build/css/*.css', 'dist/build/js/scripts.js', 'dist/**/*.html']
            },
            options: {
                server: {
                    baseDir: "./dist"
                },
                watchTask: true
            }
        },

        bake: {
            dist: {
                options: {

                },
                files: {
                    'dist/index.html': 'source/index.html'
                }
            }
        },
        xml_sitemap: {
            custom_options: {
                options: {
                    changefreq: 'weekly',
                    dest: 'dist/',
                    fileName: 'sitemap',
                    siteRoot: 'http://www.prototype.ae/',
                    lastMod: '2016-1-1T09:54:31.000Z',
                    priority: '1'
                },
                files: [{

                    cwd: 'dist/',
                    src: [
                        '**/*.html'
                    ]
                }]
            }
        },

        realFavicon: {
            favicons: {
                src: 'assets/favicon/source.png',
                dest: 'dist/build/favicon',
                options: {
                    iconsPath: '/build/favicon',
                    html: [], //Don't inject anything, thank you
                    design: {
                        ios: {
                            pictureAspect: 'noChange'
                        },
                        desktopBrowser: {},
                        windows: {
                            pictureAspect: 'noChange',
                            backgroundColor: '#da532c',
                            onConflict: 'override'
                        },
                        androidChrome: {
                            pictureAspect: 'noChange',
                            themeColor: '#ffffff',
                            manifest: {
                                name: 'Prototype',
                                display: 'browser',
                                orientation: 'notSet',
                                onConflict: 'override',
                                declared: true
                            }
                        },
                        safariPinnedTab: {
                            pictureAspect: 'blackAndWhite',
                            threshold: 30,
                            themeColor: '#6edf20'
                        }
                    },
                    settings: {
                        scalingAlgorithm: 'Mitchell',
                        errorOnImageTooSmall: false
                    }
                }
            }
        },

    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks("grunt-bake");
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-xml-sitemap');
    grunt.loadNpmTasks('grunt-real-favicon');
    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.

    grunt.registerTask('default', ['bake:dist', 'concat', 'uglify', 'sass', 'browserSync', 'watch']);
    grunt.registerTask('sitemap', ['xml_sitemap']);
    grunt.registerTask('favicon', ['realFavicon']);
};
