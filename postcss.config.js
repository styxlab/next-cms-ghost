module.exports = {
  plugins: {
    'postcss-easy-import': {},
    'postcss-color-mod-function': {},
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
      features: {
        'custom-properties': false,
      },
    },
  },
}
