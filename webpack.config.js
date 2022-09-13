import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import CopyPlugin from 'copy-webpack-plugin';
import HandlebarsPlugin from 'handlebars-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import SitemapWebpackPlugin from 'sitemap-webpack-plugin';
import SpriteLoaderPlugin from 'svg-sprite-loader/plugin.js';
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';

const SitemapPlugin = SitemapWebpackPlugin.default;

// Update this with the list of html files in /pages/en directory
const paths = [
    'index.html'
];

const buildpath = {
    main: path.resolve(__dirname, 'public'),
    js: path.resolve(__dirname, 'public/js'),
    css: path.resolve(__dirname, 'public/css'),
    images: path.resolve(__dirname, 'public/images/'),
    favicon: path.resolve(__dirname, 'public/favicon/')
};

export default {
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
                    MiniCssExtractPlugin.loader,
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
                { from: 'assets/favicon', to: buildpath.favicon },
                { from: 'assets/images', to: buildpath.images }
            ]
        }),
        new HandlebarsPlugin({
            entry: path.join(process.cwd(), 'pages', '**', '*.html'),
            output: path.join(process.cwd(), 'public', '[path]', '[name].html'),
            data: path.join(__dirname, 'pages/data.json'),
            partials: [
                path.join(process.cwd(), 'partials', '**', '*.html')
            ],
            getPartialId: (filePath) => filePath.match(`^${__dirname}/partials/(.+).html`).pop()
        }),
        new SpriteLoaderPlugin(),
        new RemoveEmptyScriptsPlugin(),
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
