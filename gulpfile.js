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

const copyRobots = function(cb) {
  return gulp.src([`${srcpath.main}/robots.txt`]).pipe(
    copy(buildpath.main, {
      prefix: 3
    })
  );
};

const copyFavicon = function(cb) {
  return gulp.src([`${srcpath.favicon}/**/*`]).pipe(
    copy(buildpath.favicon, {
      prefix: 3
    })
  );
};
const copyImages = function(cb) {
  return gulp.src([`${srcpath.images}/**/*`]).pipe(
    copy(buildpath.images, {
      prefix: 3
    })
  );
};

const webpackConfig = require("./webpack.config.dev.js");

const webpackTask = function(done) {
  webpack(webpackConfig, function(err, stats) {
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
    done();
  });
};

const webpackConfigProd = require("./webpack.config.prod.js");

const webpackProdTask = function(done) {
  webpack(webpackConfigProd, function(err, stats) {
    if (err) {
      console.error("[webpack]", err);
    }
    console.log(
      "[webpack]",
      stats.toString({
        colors: true
      })
    );
    done();
  });
};

const postcssDev = function() {
  const processors = [
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
};

const postcssProd = function() {
  const processors = [
    pixrem(),
    autoprefixer({
      browsers: ["last 2 versions", "ie >= 11"]
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
};

const svgoTask = function() {
  return gulp
    .src(`${srcpath.icons}/*.svg`)
    .pipe(svgo())
    .pipe(gulp.dest(`${srcpath.icons}/`));
};

const svgstoreTask = gulp.series(svgoTask, function(done) {
  gulp
    .src(`${srcpath.icons}/*.svg`)
    .pipe(
      rename({
        prefix: "icon-"
      })
    )
    .pipe(svgstore())
    .pipe(gulp.dest(buildpath.images));
  done();
});

const handlebarsTask = function(done) {
  const options = {
    batch: [srcpath.partials]
  };

  const files = [[`${srcpath.pages}/index.html`, "public/index.html"]];

  const tasks = files.map(filePair => {
    const src = filePair[0];
    const dist = filePair[1];
    const distDir = path.dirname(dist);
    const distFileName = path.basename(dist);

    return () =>
      gulp
        .src(src)
        .pipe(handlebars({}, options))
        .pipe(rename(distFileName))
        .pipe(gulp.dest(distDir))
        .pipe(browserSync.stream());
  });

  return gulp.series(...tasks, seriesDone => {
    seriesDone();
    done();
  })();
};

const watch = done => {
  gulp.watch(
    [`${srcpath.pages}/**/*.html`, `${srcpath.partials}/**/*.html`],
    gulp.series(handlebarsTask)
  );
  gulp.watch([`${srcpath.css}/**/*.scss`], gulp.series(postcssDev));
  gulp.watch([`${srcpath.js}/**/*.js`], gulp.series(webpackTask));
  gulp.watch([`${srcpath.icons}/*.svg`], gulp.series(svgstoreTask));
  gulp.watch([`${srcpath.images}/**/*`], gulp.series(copyImages));
  done();
};

const browserSyncTask = function(done) {
  browserSync.init({
    server: {
      baseDir: "./public"
    }
  });
  done();
};

const sitemapTask = function() {
  return gulp
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
};

const w3cjsTask = function() {
  return gulp
    .src(buildpath.main + "**/*.html")
    .pipe(w3cjs())
    .pipe(w3cjs.reporter());
};

const a11yTask = function() {
  return gulp
    .src(buildpath.main + "**/*.html")
    .pipe(
      access({
        force: true
      })
    )
    .on("error", console.log);
};

const criticalTask = function(done) {
  const files = [["index.html", "index.html"]];
  files.forEach(function(filePair) {
    critical
      .generate({
        inline: true,
        base: buildpath.main,
        src: filePair[0],
        dest: filePair[1],
        minify: true,
        width: 1440,
        height: 700
      })
      .catch(console.log);
  });
  done();
};

const copyTask = gulp.parallel(copyImages, copyFavicon, copyRobots);

const build = gulp.series(
  copyTask,
  handlebarsTask,
  svgstoreTask,
  webpackTask,
  postcssDev,
  browserSyncTask,
  watch
);

const prod = gulp.series(
  copyTask,
  svgstoreTask,
  webpackProdTask,
  postcssProd,
  handlebarsTask,
  criticalTask
);

const test = gulp.series(w3cjsTask, a11yTask);

exports.critical = criticalTask;
exports.sitemap = sitemapTask;
exports.default = build;
exports.prod = prod;
exports.test = test;
