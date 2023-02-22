import debugModule from 'debug';
import Express from 'express';

import init from './config/express.js';

const debug = debugModule('api');

const app = new Express();

// express configs
init(app);

// start app
app.listen(process.env.PORT || 8080, (error) => {
    if (!error)
        debug(`📡  Running on port: ${process.env.PORT || 8080}`);
});
