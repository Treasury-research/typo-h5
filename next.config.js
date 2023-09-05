// const removeImports = require("next-remove-imports");

// const nextConfig = {
//   reactStrictMode: false,
//   swcMinify: true,
//   eslint: {
//     dirs: ["src"],
//   },
// }

// const nextEnv = require('next-env');
// const dotenvLoad = require('dotenv-load');
// dotenvLoad('.env');

// const withNextEnv = nextEnv();

// module.exports = removeImports()

const removeImports = require("next-remove-imports");

module.exports = removeImports()({
  webpack: function (config) {
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader"
    });
    return config;
  }
});
