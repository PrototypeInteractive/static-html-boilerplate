// eslint-disable-next-line import/no-unused-modules
export default {
    plugins: [
        'autoprefixer',
        [
            'cssnano',
            {
                safe: true
            }
        ]
    ]
};
