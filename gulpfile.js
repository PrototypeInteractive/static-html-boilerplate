var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var pixrem = require('pixrem');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var browserSync = require('browser-sync').create();
var sitemap = require('gulp-sitemap');
var handlebars = require('gulp-compile-handlebars');
var path = require("path");
var rename = require('gulp-rename');
var svgstore = require('gulp-svgstore');
var svgo = require('gulp-svgo');
var copy = require('gulp-copy');
var buildpath = 'dist/';

gulp.task('copy', function(cb) {
    var images = gulp.src(['assets/images/**/*'])
        .pipe(copy(buildpath + 'images', { prefix: 2 }));
    var favicon = gulp.src(['assets/favicon/**/*'])
        .pipe(copy(buildpath + 'favicon', { prefix: 2 }));

    return [images, favicon];
});


gulp.task('concat', function() {
    return gulp.src(['assets/js/*.js'])
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('uglify', ['concat'], function(cb) {
    return gulp.src('dist/js/scripts.js'),
        uglify(),
        gulp.dest('dist');
});

gulp.task('sass', function() {
    return gulp.src(['assets/sass/style-rtl.scss', 'assets/sass/style-ltr.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('postcss:dev', ['sass'], function() {
    var processors = [
        pixrem(),
        autoprefixer({
            browsers: ['last 2 versions']
        })
    ];

    return gulp.src('dist/css/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css/'))
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

    return gulp.src('dist/css/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('dist/css/'));
});


gulp.task('svgo', function() {
    return gulp.src('assets/icons/*.svg')
        .pipe(svgo())
        .pipe(gulp.dest('assets/icons'));
});

gulp.task('svgstore', ['svgo'], function() {
    return gulp
        .src('assets/icons/*.svg')
        .pipe(rename({ prefix: 'icon-' }))
        .pipe(svgstore())
        .pipe(gulp.dest(buildpath + 'images'));
});


gulp.task('watch', function() {
    gulp.watch(['source/**/*.html', 'partials/**/*.html'], ['handlebars']);
    gulp.watch(['assets/sass/*.scss'], ['sass', 'postcss:dev']);
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

gulp.task('handlebars', function() {
    var options = {
        batch: ['partials']
    };

    var files = [
        ['source/index.html', 'dist/index.html']
    ];

    return files.forEach(function(filePair) {
        var src = filePair[0];
        var dist = filePair[1];
        var distDir = path.dirname(dist);
        var distFileName = path.basename(dist);

        return gulp.src(src)
            .pipe(handlebars({}, options))
            .pipe(rename(distFileName))
            .pipe(gulp.dest(distDir))
            .pipe(browserSync.stream());
    });
});


gulp.task('w3cjs', function() {
    var w3cjs = require('gulp-w3cjs');
    return gulp.src('dist/**/*.html')
        .pipe(w3cjs())
        .pipe(w3cjs.reporter());
});


gulp.task('a11y', function() {
    var access = require('gulp-accessibility');
    return gulp.src('dist/**/*.html')
        .pipe(access({
            force: true
        }))
        .on('error', console.log);
});


gulp.task('default', ['copy', 'handlebars', 'svgstore', 'concat', 'postcss:dev', 'browserSync', 'watch']);
gulp.task('prod', ['copy', 'handlebars', 'svgstore', 'uglify', 'postcss:prod']);
gulp.task('sitemap', ['xml_sitemap']);
