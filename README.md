# Static HTML Boilerplate

The boilerplate is an opinionated folder structure to help you kick-start your html project. It includes the necessary build tools and configurations and is easily extendable.

### Requirements

*   [Node.js](http://nodejs.org): for all the magic

### What's included

*   [Bootstrap 5](http://getbootstrap.com/): Bootstrap's normalize, grid system, and utility classes are imported by default.
*   [Webpack](https://webpack.js.org/): With babel, allows you to use ES6 code and modules.
*   [Handlebars](http://handlebarsjs.com/): Build your html with partials.
*   [SVG sprites](https://css-tricks.com/svg-sprites-use-better-icon-fonts/): Add your icons in `assets/icons` and use them.
*   Server: Node.js code for easy, gzipped, and secure static website hosting.

### How to proceed

1.  Prepare a coffee
1.  Run: `npm i` to install the dependencies
1.  Run: `npm run dev` to build and watch
1.  Start coding!


### Notes:
* To add a new page to the site, you must add the mapping in `webpack.config.js` for the sitemap. Add the corresponding file path to the `paths` array.

The following is an example to adding a `contact-us` page:
```javascript
const paths = [
    'index.html',
    'about-us/index.html',
    'support/terms/index.html'
];
```

* Use [realfavicongenerator.net](https://realfavicongenerator.net/) to generate the favicon and metadata

### Code quality

The boilerplate includes a built in linter configuration:

`npm run lint`

### [Changelog](CHANGELOG.md)
