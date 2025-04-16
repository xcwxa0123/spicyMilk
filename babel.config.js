module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@assets': './src/assets',
          "@components": './src/components',
          "@pages": './src/pages',
          "@tools": './src/tools',
        },
      },
    ],
    // '@realm/babel-plugin',
    // ['@babel/plugin-proposal-decorators', { legacy: true }],
  ]
};
