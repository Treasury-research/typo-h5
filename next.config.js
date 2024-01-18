// const withImages = require('next-images')

// const withTM = require("next-transpile-modules")([
//   "react-vant",
// ]);

const withRemoveImports = require("next-remove-imports")();

module.exports =
  withRemoveImports(
    {
      exportPathMap: function () {
        return {
          "/locales/de-DE/summer-dress-f": {
            page: "/locales/[locale]/[slug]",
            query: { locale: "de-DE", slug: "summer-dress-f" }
          }
        };
      },
      webpack: (config, options) => {
        config.module.rules.push({
          test: /\.md$/,
          use: "raw-loader"
        });
        return config;
      },
    }
  );
