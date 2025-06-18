// babel.config.js
module.exports = function (api) {
  api.cache(true);               // speeds up rebuilds
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 👇 MUST be last in this array
      'react-native-reanimated/plugin',
    ],
  };
};
