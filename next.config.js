// const withImages = require('next-images')

// const withTM = require("next-transpile-modules")([
//   "react-vant",
// ]);

const withRemoveImports = require("next-remove-imports")();

module.exports =
  withRemoveImports(
    {
      webpack: (config, options) => {
        config.module.rules.push({
          test: /\.md$/,
          use: "raw-loader"
        });
        return config;
      },
    }
  );
