# Static HTML Boilerplate

The boilerplate is an opinionated folder structure to help you kick-start your html project. It includes the necessary build tools and configurations and is easily extendable.

### Requirements

*   [Node.js](http://nodejs.org): for all the magic

### What's included

*   [Bootstrap 3](http://getbootstrap.com/): Bootstrap's normalize, grid system, and utility classes are imported by default.
*   [Webpack](https://webpack.js.org/): With babel, allows you to use ES6 code and modules.
*   [Handlebars](http://handlebarsjs.com/): Build your html with partials.
*   [SVG sprites](https://css-tricks.com/svg-sprites-use-better-icon-fonts/): Add your icons in `assets/icons` and use them.
*	Server: Node.js code for easy, gzipped, and secure static website hosting.
*   [BrowserSync](https://www.browsersync.io/): As a development server.
*   [jQuery](http://jquery.com/): jQuery is included as external in webpack.

### How to proceed

1.  Prepare a coffee
1.  Run: `npm i` to install the dependencies
1.  Run: `gulp` to build and watch
1.  Start coding!

### Test

The boilerplate includes three necessary tests for your code:

* an HTML5 validator (`npm run w3js`),
* an accessibility reporter (`npm run a11y`),
* and a eslint linter (airbnb) (`npm run lint`).

### Deploy

You only need to deploy the server code and the dist folder.

[Deploy on AWS EB](https://github.com/PrototypeInteractive/standards/wiki/elasticbeanstalk)

### Changelog

#### **0.5.5** - jQuery is now [opt-in](http://youmightnotneedjquery.com/), to add it:

In webpack config, add jQuery as an external

```
externals: {
  jquery: 'jQuery'
}
```

In `scripts.html` add jQuery from google CDN

`<script defer src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>`

#### **0.5.4** - Added eslint with airbnb

#### **0.5.3** - Windows support in npm scripts

#### **0.5.0** - ES6 with babel and webpack

The boilerplate now uses webpack to concatinate and uglify the javascript code (instead of the gulp plugins). This allows better control over the generated code and removes the need to manually add links to the plugins in the required order.

In the old way, to add a new plugin we had to add the path of the installed module to gulp concat before the files that are using it. instead now, just use the es6 imports to import the plugin when needed.

For example, to include slick:

**Old way:**

Inside gulpfile.js

```
gulp.task('concat', function() {
    return gulp.src([
+            'node_modules/slick-carousel/slick/slick.js',
        ])
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('dist/js/'));
});
```

**New way:**

Where the plugin is needed

```
import slick from 'slick-carousel'
```

In addition, you can now use [ES6 classes](http://exploringjs.com/es6/ch_classes.html#sec_essentials-classes).

Webpack can be further optimized with multiple entry points and tree shaking based on the project needs.

#### **0.4.0** - Using icons

Icons are included via an svg sprite, to include and use an icon do the following:

1. Export the icon svg from Sketch/Illustrator. Make sure the path is outlined
2. Remove any `fill` or `fill-rule` from the svg file
3. Add the file to `assets/icons`
4. gulp will compress the svg and add it to `dist/images/icons.svg`
5. Use it as an svg symbol:

```
<svg aria-hidden="true" role="presentation" width='10' height='10'>
    <title>Description</title>
    <use xlink:href="/images/icons.svg#icon-name"></use>
</svg>
```

Note that accessibility tests will consider links as empty if they only have an svg. Add a visually hidden span with the text.

### Pipeline

[ ] Add imageoptim [CLI](https://github.com/JamieMason/ImageOptim-CLI#installation).
