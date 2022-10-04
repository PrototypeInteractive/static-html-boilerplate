const auth = require('basic-auth');
const compression = require('compression');
const debug = require('debug')('api');
const helmet = require('helmet');
const serveStatic = require('serve-static');

module.exports = (app) => {
    const production = process.env.NODE_ENV === 'production';
    app.use(
        helmet({
            hsts: false,
            noSniff: false
        })
    );

    app.use(compression());

    if (!production) {
        const username = process.env.AUTH_USER || 'prototype';
        const password = process.env.AUTH_PASS || 'prototype';
        app.use((req, res, next) => {
            const user = auth(req);

            if (user === undefined || user.name !== username || user.pass !== password) {
                res.statusCode = 401;
                res.setHeader('WWW-Authenticate', 'Basic realm="prototype"');
                res.end('Unauthorized');
            } else
                next();
        });
    }

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader(
            'Content-Security-Policy',
            'default-src *; img-src * \'self\' data: https:; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' *; style-src  \'self\' \'unsafe-inline\' *'
        );

        if (!production)
            res.setHeader('X-Robots-Tag', 'noindex, nofollow');

        next();
    });

    app.get('/robots.txt', (req, res, next) => {
        if (!production)
            res.end();
        else
            next();
    });

    app.use(
        serveStatic('public', {
            index: [ 'index.html' ],
            dotfiles: 'ignore',
            maxAge: production ? '7d' : '0d',
            setHeaders: (res, path) => {
                if (serveStatic.mime.lookup(path) === 'text/html')
                    res.setHeader('Cache-Control', 'public, max-age=0');
            }
        })
    );

    app.get('*', (req, res) => {
        res.status(404).end();
    });

    debug('--------------------------');
    debug('☕️ ');
    debug('Starting Server');
    debug(`Environment: ${process.env.NODE_ENV}`);
};
