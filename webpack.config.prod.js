import webpack from 'webpack';

import baseConfig from './webpack.config.js';

export default {
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
