var webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: {
    "content-script": "./js/content-script.js",
    "background": "./js/background.js",
    "popup": "./js/popup.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "./dist"),
  },
};
