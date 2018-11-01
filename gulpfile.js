/* eslint-disable */

const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const pixrem = require("pixrem");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const browserSync = require("browser-sync").create();
const sitemap = require("gulp-sitemap");
const handlebars = require("gulp-compile-handlebars");
const path = require("path");
const rename = require("gulp-rename");
const svgstore = require("gulp-svgstore");
const svgo = require("gulp-svgo");
const copy = require("gulp-copy");
const webpack = require("webpack");
const critical = require("critical");
const w3cjs = require("gulp-w3cjs");
const access = require("gulp-accessibility");

const srcpath = {
  main: "src/assets",
  css: "src/assets/sass",
  pages: "src/pages",
  partials: "src/partials",
  icons: "src/assets/icons",
  images: "src/assets/images",
  favicon: "src/assets/favicon"
};

const buildpath = {
  main: "public/",
  js: "public/js/",
  css: "public/css/",
  images: "public/images/",
  favicon: "public/favicon/"
};

const stylesheets = [
  `${srcpath.css}/style.rtl.scss`,
  `${srcpath.css}/style.scss`
];

gulp.task("copy", ["copy:favicon", "copy:images", "copy:robots"]);

gulp.task("copy:robots", function(cb) {
  return gulp.src([`${srcpath.main}/robots.txt`]).pipe(
    copy(buildpath.main, {
      prefix: 3
    })
  );
});

gulp.task("copy:favicon", function(cb) {
  return gulp.src([`${srcpath.favicon}/**/*`]).pipe(
    copy(buildpath.favicon, {
      prefix: 3
    })
  );
});

gulp.task("copy:images", function(cb) {
  return gulp.src([`${srcpath.images}/**/*`]).pipe(
    copy(buildpath.images, {
      prefix: 3
    })
  );
});

gulp.task("webpack", function() {
  return webpack(require("./webpack.config.dev.js"), function(err, stats) {
    if (err) {
      console.error("webpack", err);
    }
    console.log(
      "[webpack]",
      stats.toString({
        colors: true
      })
    );
    browserSync.reload();
  });
});

gulp.task("webpack:prod", function(cb) {
  return webpack(require("./webpack.config.prod.js"), function(err, stats) {
    if (err) {
      console.error("[webpack]", err);
    }
    console.log(
      "[webpack]",
      stats.toString({
        colors: true
      })
    );
  });
});

gulp.task("postcss:dev", function() {
  const processors = [
    pixrem(),
    autoprefixer({
      browsers: ["last 2 versions"]
    })
  ];

  return gulp
    .src(stylesheets)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss(processors))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(buildpath.css))
    .pipe(
      browserSync.stream({
        match: "**/*.css"
      })
    );
});

gulp.task("postcss:prod", function() {
  const processors = [
    pixrem(),
    autoprefixer({
      browsers: ["last 2 versions"]
    }),
    cssnano({
      safe: true
    })
  ];

  return gulp
    .src(stylesheets)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss(processors))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(buildpath.css));
});

gulp.task("svgo", function() {
  return gulp
    .src(`${srcpath.icons}/*.svg`)
    .pipe(svgo())
    .pipe(gulp.dest(`${srcpath.icons}/`));
});

gulp.task("svgstore", ["svgo"], function() {
  return gulp
    .src(`${srcpath.icons}/*.svg`)
    .pipe(
      rename({
        prefix: "icon-"
      })
    )
    .pipe(svgstore())
    .pipe(gulp.dest(buildpath.images));
});

gulp.task("watch", function() {
  gulp.watch(
    [`${srcpath.css}/**/*.html`, `${srcpath.css}/**/*.html`],
    ["handlebars"]
  );
  gulp.watch([`${srcpath.css}/**/*.scss`], ["postcss:dev"]);
  gulp.watch([`${srcpath.js}/**/*.js`], ["webpack"]);
  gulp.watch([`${srcpath.icons}/*.svg`], ["svgstore"]);
  gulp.watch([`${srcpath.images}/**/*`], ["copy:images"]);
});

gulp.task("browserSync", function() {
  browserSync.init({
    server: {
      baseDir: "./public"
    }
  });
});

gulp.task("sitemap", function() {
  gulp
    .src("public/**/*.html", {
      read: false
    })
    .pipe(
      sitemap({
        changefreq: "weekly",
        siteUrl: "http://www.prototype.ae/",
        lastmod: "2016-01-01T09:54:31.000Z",
        priority: "1"
      })
    )
    .pipe(gulp.dest(buildpath.main));
});

gulp.task("handlebars", function() {
  const options = {
    batch: [srcpath.partials]
  };

  const files = [[`${srcpath.pages}/index.html`, "public/index.html"]];

  return files.map(filePair => {
    const src = filePair[0];
    const dist = filePair[1];
    const distDir = path.dirname(dist);
    const distFileName = path.basename(dist);

    return gulp
      .src(src)
      .pipe(handlebars({}, options))
      .pipe(rename(distFileName))
      .pipe(gulp.dest(distDir))
      .pipe(browserSync.stream());
  });
});

gulp.task("w3cjs", function() {
  return gulp
    .src(buildpath.main + "**/*.html")
    .pipe(w3cjs())
    .pipe(w3cjs.reporter());
});

gulp.task("a11y", function() {
  return gulp
    .src(buildpath.main + "**/*.html")
    .pipe(
      access({
        force: true
      })
    )
    .on("error", console.log);
});

gulp.task("critical", ["handlebars"], function(cb) {
  const files = [["index.html", "index.html"]];

  files.forEach(function(filePair) {
    critical.generate({
      inline: true,
      base: buildpath.main,
      src: filePair[0],
      dest: filePair[1],
      minify: true,
      width: 1440,
      height: 700
    });
  });
});

gulp.task("default", [
  "copy",
  "handlebars",
  "svgstore",
  "webpack",
  "postcss:dev",
  "browserSync",
  "watch"
]);
gulp.task("prod", [
  "copy",
  "critical",
  "svgstore",
  "webpack:prod",
  "postcss:prod"
]);
gulp.task("test", ["w3cjs", "a11y"]);
