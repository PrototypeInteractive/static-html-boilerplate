# Static HTML Boilerplate

### Requirements

*   [Node.js](http://nodejs.org): for all the magic

    Nodejs is necessary for bower, gulp, and all the extra modules you might need.

*   [Gulp](http://gulp.com/): Javascript taskrunner

    You don't deploy your code with 17 style file and 21 javascript file. Alongisde many other things, gulp has some plugins to tidy up your assets. gulp will be installed when you install npm modules.

### What's included

*   **assets**: all you javascript and css should sit here
	*   **css**: already reference bootstrap sass files, remove the one you don't need
    *   **js**: javascript
    *   **favicon**: build your favicons on [realfavicongenerator](http://realfavicongenerator.net/)
    *	**icons**: All svgs put here will be compressed and added in an svg sprite
*   **dist**: grunt should take the assets, minify them, and put them inside this folder.
*   **.gitignore**: you should know.
*   **package.json**: list of all the node and front-end dependecies
*	**server**: Node.js code for easy, gzipped, and secure static website hosting

### How to proceed

1.  Prepare a coffee
2.  Install Node.js and NPM
3.  Run: `npm i` to install the dependencies
4.  Run: `gulp` to build and start watching
5.  Start coding!

### Test

The new version includes two necessary tests for your html code, an HTML5 validator (`gulp w3js`), an accessibility reporter (`gulp a11y`), and a jshint linter (`gulp jshint`);

### Deploy

[Deploy on AWS EB](https://devstand.prototype.rocks/standards/eb/)

### Latest changes

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
