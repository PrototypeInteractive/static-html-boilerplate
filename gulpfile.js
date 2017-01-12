const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const pixrem = require('pixrem');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserSync = require('browser-sync').create();
const sitemap = require('gulp-sitemap');
const handlebars = require('gulp-compile-handlebars');
const path = require("path");
const rename = require('gulp-rename');
const svgstore = require('gulp-svgstore');
const svgo = require('gulp-svgo');
const copy = require('gulp-copy');
const jshint = require('gulp-jshint');

const buildpath = 'dist/';


gulp.task('copy', ['copy:favicon', 'copy:images']);

gulp.task('copy:favicon', function(cb) {
    return gulp.src(['assets/favicon/**/*'])
        .pipe(copy(buildpath + 'favicon', { prefix: 2 }));
});

gulp.task('copy:images', function(cb) {
    return gulp.src(['assets/images/**/*'])
        .pipe(copy(buildpath + 'images', { prefix: 2 }));
});


gulp.task('concat', function() {
    return gulp.src(['assets/js/*.js'])
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('uglify', ['concat'], function(cb) {
    return gulp.src('dist/js/scripts.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
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
    gulp.watch(['assets/sass/**/*.scss'], ['sass', 'postcss:dev']);
    gulp.watch(['assets/js/*.js'], ['concat', 'uglify']);
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});

gulp.task('sitemap', function() {
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

gulp.task('jshint', function() {
  return gulp.src('assets/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('critical', function(cb) {
    var critical = require('critical');
    var files = [
        ['index.html', 'dist/index.html']
    ];

    files.forEach(function(filePair) {
        critical.generate({
            inline: true,
            base: 'dist/',
            src: filePair[0],
            dest: filePair[1],
            minify: true,
            width: 1440,
            height: 700
        });
    });
});

gulp.task('default', ['copy', 'handlebars', 'svgstore', 'concat', 'postcss:dev', 'browserSync', 'watch']);
gulp.task('prod', ['copy', 'handlebars', 'svgstore', 'uglify', 'postcss:prod']);
gulp.task('test', ['w3cjs', 'a11y', 'jshint']);
