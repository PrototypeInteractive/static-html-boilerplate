var express = require('express');
var serveStatic = require('serve-static');
var compression = require('compression');

var app = express();

app.use(compression());

app.use(serveStatic('dist', {
    'index': ['index.html'],
    'dotfiles': 'ignore',
    'maxAge': '1d',
    'setHeaders': setCustomCacheControl
}));

app.get('*', function(req, res) {
    res.redirect("/404/");
});

app.listen(process.env.PORT || 81);

function setCustomCacheControl(res, path) {
    if (serveStatic.mime.lookup(path) === 'text/html') {
        // Custom Cache-Control for HTML files
        res.setHeader('Cache-Control', 'public, max-age=0')
    }
}
