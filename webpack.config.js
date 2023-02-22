import path from 'path';

import CopyPlugin from 'copy-webpack-plugin';
import HandlebarsHelpers from 'handlebars-helpers';
import HandlebarsPlugin from 'handlebars-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import SitemapPluginModule from 'sitemap-webpack-plugin';
import SpriteLoaderPlugin from 'svg-sprite-loader/plugin.js';
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';

const SitemapPlugin = SitemapPluginModule.default;

// Update this with the list of html files in /pages/en directory
const paths = [
    'index.html'
];

const buildpath = {
    main: './public',
    js: './public/js',
    css: './public/css',
    images: './public/images/'
};

const webpackCommonConfig = {
    entry: {
        scripts: './assets/js/main.js',
        'style-ltr': './assets/sass/style-ltr.scss',
        'style-rtl': './assets/sass/style-rtl.scss'
    },
    output: {
        filename: './js/[name].js',
        path: path.resolve(buildpath.main),
        publicPath: path.resolve('./public')
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
            data: './assets/data.json',
            partials: [
                path.join(process.cwd(), 'partials', '**', '*.html')
            ],
            getPartialId: (filePath) => filePath.match(`^${path.resolve('.')}/partials/(.+).html`).pop(),
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

// eslint-disable-next-line import/no-unused-modules
export default webpackCommonConfig;
