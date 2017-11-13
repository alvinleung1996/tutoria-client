const path = require('path');
const webpack = require('webpack');

module.exports = {

  entry: {
    index: path.resolve(__dirname, '../src/index.js')
  },

  module: {
    rules: [

    ]
  },

  plugins: [
    // new webpack.optimize.CommonsChunkPlugin({

    // }),
  ],

  devtool: 'source-map',

};
