const baseConfig = require('./webpack.config');

module.exports = {
    ...baseConfig,
    mode: 'development',
    devtool: 'source-map',
    optimization: {
        minimize: false
    },
    devServer: {
        devMiddleware: {
            writeToDisk: true
        },
        open: [ 'en' ]
    }
};
