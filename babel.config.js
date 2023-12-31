module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["module:react-native-dotenv"],
      [
        "module-resolver",
        {
          alias: {
            "@src": "./src",
            "@api": "./src/api",
            "@screens": "./src/screens",
            "@features": "./src/features",
            "@store": "./src/store",
            "@navigation": "./src/navigation",
            "@components": "./src/components",
            "@utils": "./src/utils",
            "@assets": "./assets",
          },
        },
      ],
    ],
  };
};
