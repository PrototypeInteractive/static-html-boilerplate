var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './assets/js/main.js',
    output: {
        filename: 'scripts.js',
        path: path.resolve(__dirname, 'dist', 'js')
    },
    externals: {
        jquery: 'jQuery'
    },
    module: {
        rules: [{
            test: /\.js?$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
                screw_ie8: true,
                keep_fnames: true
            },
            compress: {
                screw_ie8: true
            },
            comments: false
        })
    ]
};
