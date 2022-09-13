import baseConfig from './webpack.config.js';

export default {
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
