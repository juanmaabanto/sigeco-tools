module.exports = {
    presets: [
      '@babel/preset-react',
      ['@babel/preset-env', { modules: false }],
    ],
    plugins: [
      'optimize-clsx',
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-transform-react-jsx'],
      // for IE 11 support
      '@babel/plugin-transform-object-assign',
      './remove-prop-types.js',
    ],
};