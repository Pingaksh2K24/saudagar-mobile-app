module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
  ['module:react-native-dotenv', {
    moduleName: '@env',
    path: '.env',
    safe: false,
    allowUndefined: true,
  }],
   [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@utils': './src/utils',
        },
      },
    ],
]
};
