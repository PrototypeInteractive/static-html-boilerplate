const debug = require('debug')('api');
const Express = require('express');

const app = new Express();

// express configs
require('./config/express')(app);

// start app
app.listen(process.env.PORT || 8080, (error) => {
    if (!error)
        debug(`📡  Running on port: ${process.env.PORT || 8080}`);
});
