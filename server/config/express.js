'use strict';
var debug = require('debug')('api');

var express = require('express');
var serveStatic = require('serve-static');
var compression = require('compression');
var helmet = require('helmet');
var auth = require('basic-auth');


module.exports = function(app) {

    app.use(helmet({
        hsts: false,
        noSniff: false
    }));

    app.use(compression());

    app.use(function(req, res, next) {
        var user = auth(req);
        if (user === undefined || user['name'] !== 'prototype' || user['pass'] !== 'prototype') {
            res.statusCode = 401;
            res.setHeader('WWW-Authenticate', 'Basic realm="prototype"');
            res.end('Unauthorized');
        } else {
            next();
        }
    });

    app.use(function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.setHeader('Access-Control-Allow-Credentials', true);

        if (process.env.NODE_ENV !== 'production') {
            res.setHeader('X-Robots-Tag', "noindex, nofollow");
        }

        next();
    });


    app.use(serveStatic('dist', {
        'index': ['index.html'],
        'dotfiles': 'ignore',
        'maxAge': '7d',
        'setHeaders': setCustomCacheControl
    }));

    debug('--------------------------');
    debug('☕️ ');
    debug('Starting Server');
    debug('Environment: ' + process.env.NODE_ENV);

    function setCustomCacheControl(res, path) {
        if (process.env.NODE_ENV !== 'production') {
            res.setHeader('Cache-Control', 'public, max-age=0')
        } else {
            if (serveStatic.mime.lookup(path) === 'text/html') {
                res.setHeader('Cache-Control', 'public, max-age=0')
            }
        }
    }
}
