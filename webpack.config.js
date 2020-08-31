const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require("path");

module.exports = {
  entry: {
    "content-script": "./js/content-script.js",
    "popup": "./js/popup.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader', 
          'sass-loader'
        ]
      }
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
};
