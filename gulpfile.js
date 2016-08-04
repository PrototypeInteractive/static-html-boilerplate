var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var pump = require('pump');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var pixrem = require('pixrem');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var notifier = require('node-notifier');
var browserSync = require('browser-sync').create();
var sitemap = require('gulp-sitemap');
var realFavicon = require('gulp-real-favicon');
var del = require('del');
var handlebars = require('gulp-compile-handlebars');
var path = require("path");
var rename = require('gulp-rename');

gulp.task('concat', function() {
    return gulp.src(['assets/js/main.js'])
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('dist/build/js/'));
});

gulp.task('uglify', function(cb) {
    pump([
            gulp.src('dist/build/js/scripts.js'),
            uglify(),
            gulp.dest('dist'),
            browserSync.stream({
                once: true
            })
        ],
        cb
    );
});

gulp.task('sass', function() {
    return gulp.src(['assets/sass/style-rtl.scss', 'assets/sass/style-ltr.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/build/css/'));
});

gulp.task('postcss:dev', ['sass'], function() {
    var processors = [
        pixrem(),
        autoprefixer({
            browsers: ['last 2 versions']
        })
    ];

    return gulp.src('dist/build/css/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/build/css/'))
        .pipe(browserSync.stream({
            match: "**/*.css"
        }));
});

gulp.task('postcss:prod', ['sass'], function() {
    var processors = [
        pixrem(),
        autoprefixer({
            browsers: ['last 2 versions']
        }),
        cssnano({
            safe: true
        })
    ];

    return gulp.src('dist/build/css/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('dist/build/css/'));
});

gulp.task('notify:bake', function() {
    return notifier.notify({
        title: 'HTML Built',
        message: 'HTML Built Successfuly',
        time: 5000
    });
});

gulp.task('notify:sass', function() {
    return notifier.notify({
        title: 'SASS Compiled Successfuly',
        message: 'SASS finished',
        time: 5000
    });
});

gulp.task('watch', function() {
    gulp.watch(['**/source/**/*.html', '**/partials/**/*.html'], ['bake', 'notify:bake']);
    gulp.watch(['assets/sass/*.scss'], ['sass', 'notify:sass', 'postcss:dev']);
    gulp.watch(['assets/js/*.js'], ['concat', 'uglify']);
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});

gulp.task('xml_sitemap', function() {
    gulp.src('dist/**/*.html', {
            read: false
        })
        .pipe(sitemap({
            changefreq: 'weekly',
            siteUrl: 'http://www.prototype.ae/',
            lastmod: '2016-01-01T09:54:31.000Z',
            priority: '1'
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('realFavicon', function(done) {
    realFavicon.generateFavicon({
        masterPicture: 'assets/favicon/source.png',
        dest: 'dist/build/favicon',
        iconsPath: '/build/favicon',
        markupFile: 'dist/build/favicon/bug.html',
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
    }, function() {
        done();
        del('dist/build/favicon/bug.html');
    });
});

gulp.task('handlebars', function() {
    var options = {
        batch: ['partials']
    };

    var files = [
        ['source/index.html', 'dist/index.html']
    ];

    files.forEach(function(filePair) {
        var src = filePair[0];
        var dist = filePair[1];
        var distDir = path.dirname(dist);
        var distFileName = path.basename(dist);

        gulp.src(src)
            .pipe(handlebars({}, options))
            .pipe(rename(distFileName))
            .pipe(gulp.dest(distDir));
    });
});


gulp.task('default', ['handlebars', 'concat', 'postcss:dev', 'browserSync', 'watch']);
gulp.task('prod', ['handlebars', 'concat', 'uglify', 'postcss:prod']);
gulp.task('sitemap', ['xml_sitemap']);
gulp.task('favicon', ['realFavicon']);
