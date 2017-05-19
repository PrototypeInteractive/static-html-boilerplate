var path = require('path');

module.exports = {
    entry: './assets/js/main.js',
    output: {
        filename: 'scripts.js',
        path: path.resolve(__dirname, 'dist', 'js')
    },
    module: {
        rules: [{
            test: /\.js?$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }]
    }
};
