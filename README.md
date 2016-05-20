# Static HTML Template

### Requirements

*   #### [Node.js](http://nodejs.org): for all the magic

    Nodejs is necessary for bower, grunt, and all the extra modules you might need.

*   #### [Grunt](http://gruntjs.com/): Javascript taskrunner

    You don't deploy your code with 17 style file and 21 javascript file. Alongisde many other things, grunt has some plugins to tidy up your assets.

### What's inside

*   **assets**: all you javascript and css should sit here
*   *   **css**: already reference bootstrap less files, remove the one you don't need
    *   **js**: javascript
    *   **favicon**: build your favicons on [realfavicongenerator](http://realfavicongenerator.net/)
*   **build**: grunt should take the assets, minify them, and put them inside this folder.
*   **.gitignore**: you should know.
*   **package.json**: list of all the node and front-end dependecies
*   **robots.txt**

### How to proceed

1.  Prepare a coffee
2.  Install Node.js and NPM
3.  Use NPM to install Grunt-cli globally
4.  Run: `npm install` to install the dependancies
6.  Run: `grunt` to build and start watching
7.  Start coding!

### Considerations
*	To create a more professional look and hide the .html extension, create new pages as index.html and put them inside folder
*	Think modular, create your html engulfed in `<section>` and try as much as possible to style html tags instead of adding classes and ids, think about sitefinity
