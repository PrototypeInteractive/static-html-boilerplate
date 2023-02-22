import webpack from 'webpack';

import baseConfig from './webpack.config.js';

const webpackProdConfig = {
    ...baseConfig,
    mode: 'production',
    devtool: 'source-map',
    optimization: {
        minimize: true
    },
    plugins: [
        ...baseConfig.plugins,
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
};

// eslint-disable-next-line import/no-unused-modules
export default webpackProdConfig;
