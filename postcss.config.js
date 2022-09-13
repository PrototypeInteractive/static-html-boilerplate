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
