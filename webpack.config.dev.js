import baseConfig from './webpack.config.js';

const webpackDevConfig = {
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

// eslint-disable-next-line import/no-unused-modules
export default webpackDevConfig;
