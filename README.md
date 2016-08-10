# Static HTML Template

### Requirements

*   #### [Node.js](http://nodejs.org): for all the magic

    Nodejs is necessary for bower, grunt, and all the extra modules you might need.

*   #### [Gulp](http://gulp.com/): Javascript taskrunner

    You don't deploy your code with 17 style file and 21 javascript file. Alongisde many other things, gulp has some plugins to tidy up your assets.

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
3.  Run: `npm i` to install the dependancies
4.  Run: `gulp` to build and start watching
5.  Start coding!