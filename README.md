# Static HTML Boilerplate

The boilerplate is an opinionated folder structure to help you kick-start your html project. It includes the necessary build tools and configurations and is easily extendable.

### Requirements

*   [Node.js](http://nodejs.org): for all the magic

### What's included

*   [Bootstrap 4](http://getbootstrap.com/): Bootstrap's normalize, grid system, and utility classes are imported by default.
*   [Webpack](https://webpack.js.org/): With babel, allows you to use ES6 code and modules.
*   [Handlebars](http://handlebarsjs.com/): Build your html with partials.
*   [SVG sprites](https://css-tricks.com/svg-sprites-use-better-icon-fonts/): Add your icons in `assets/icons` and use them.
*	Server: Node.js code for easy, gzipped, and secure static website hosting.
*   [BrowserSync](https://www.browsersync.io/): As a development server.
*	[gulp](https://gulpjs.com/): Used to build sass, build svgs, run handlebars, and copy files to public folder.

### How to proceed

1.  Prepare a coffee
1.  Run: `npm i` to install the dependencies
1.  Run: `npm run dev` to build and watch
1.  Start coding!


### Notes:
* To add a new page to the site, you must add the mapping to the `gulpfile.js` inside the `handlebars` gulp task, modify the `files` variable and add the mapping to URL.

The following is an example to adding a `contact-us` page:
```
var files = [
  ['source/index.html', 'public/index.html'],
  ['source/contact-us.html', 'public/contact-us/index.html']
];
```

### Test

The boilerplate includes three necessary tests for your code:

* a HTML5 validator (`npm run w3js`),
* an accessibility reporter (`npm run a11y`),
* and an eslint linter (airbnb) (`npm run lint`).

### Deploy

1.  Run: `npm run deploy` to build 

You only need to deploy the server code and the public folder.

[Deploy on AWS EB](https://github.com/PrototypeInteractive/standards/wiki/elasticbeanstalk)

### [Changelog](CHANGELOG.md)
