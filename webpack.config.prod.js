const webpack = require('webpack');

const baseConfig = require('./webpack.config');

module.exports = {
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
