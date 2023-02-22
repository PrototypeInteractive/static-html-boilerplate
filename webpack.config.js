const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const HandlebarsHelpers = require('handlebars-helpers')();
const HandlebarsPlugin = require('handlebars-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SitemapPlugin = require('sitemap-webpack-plugin').default;
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

// Update this with the list of html files in /pages/en directory
const paths = [
    'index.html'
];

const buildpath = {
    main: path.resolve(__dirname, 'public'),
    js: path.resolve(__dirname, 'public/js'),
    css: path.resolve(__dirname, 'public/css'),
    images: path.resolve(__dirname, 'public/images/')
};

module.exports = {
    entry: {
        scripts: './assets/js/main.js',
        'style-ltr': './assets/sass/style-ltr.scss',
        'style-rtl': './assets/sass/style-rtl.scss'
    },
    output: {
        filename: './js/[name].js',
        path: buildpath.main,
        publicPath: './public'
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            extract: true,
                            spriteFilename: './images/icons.svg'
                        }
                    },
                    'svgo-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '/'
                        }
                    },
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'assets/robots.txt', to: buildpath.main },
                { from: 'assets/static', to: buildpath.main },
                { from: 'assets/images', to: buildpath.images },
                { from: 'assets/images', to: buildpath.images }
            ]
        }),
        new HandlebarsPlugin({
            entry: path.join(process.cwd(), 'pages', '**', '*.html'),
            output: path.join(process.cwd(), 'public', '[path]', '[name].html'),
            data: path.join(__dirname, 'assets/data.json'),
            partials: [
                path.join(process.cwd(), 'partials', '**', '*.html')
            ],
            getPartialId: (filePath) => filePath.match(`^${__dirname}/partials/(.+).html`).pop(),
            helpers: {
                ...HandlebarsHelpers,
                inlineArray: (...args) => args.slice(0, -1)
            }
        }),
        new SpriteLoaderPlugin(),
        new RemoveEmptyScriptsPlugin({
            stage: RemoveEmptyScriptsPlugin.STAGE_AFTER_PROCESS_PLUGINS
        }),
        new MiniCssExtractPlugin({
            filename: './css/[name].css'
        }),
        new SitemapPlugin({
            base: 'https://prototype.net',
            options: {
                changefreq: 'weekly',
                lastmod: new Date().toISOString().toString(),
                priority: 1
            },
            paths: paths.map((pathItem) => ([
        `./en/${pathItem.endsWith('index.html') ? '' : pathItem}`,
        `./ar/${pathItem.endsWith('index.html') ? '' : pathItem}`
            ])).flat()
        })
    ]
};
