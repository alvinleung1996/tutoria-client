const path = require('path');
const webpack = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

  entry: {
    index: path.resolve(__dirname, '../src/index.js')
  },

  module: {
    rules: [

    ]
  },

  plugins: [
    new CleanWebpackPlugin([
      path.resolve(__dirname, '../../tutoria-server/tutoriaserver/static')
    ], {
      allowExternal: true
    }),
    // new webpack.optimize.CommonsChunkPlugin({

    // }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../node_modules/@webcomponents/webcomponentsjs/@(webcomponents|custom-elements)*.js'),
      to: path.resolve(__dirname, '../../tutoria-server/tutoriaserver/static/[name].[ext]')
    }]),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.ejs'),
      filename: path.resolve(__dirname, '../../tutoria-server/tutoriaserver/templates/tutoriaserver/index.html'),
      inject: false
    })
  ],

  output: {
    path: path.resolve(__dirname, '../../tutoria-server/tutoriaserver/static'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js'
  },

  devtool: 'source-map',

  devServer: {
    host: '0.0.0.0',
    contentBase: path.resolve(__dirname, '../out'),
    historyApiFallback: {
      rewrites: [
        // {
        //   from: /^\/static\/(.*)$/,
        //   to: function(context) {
        //     return `/${context.match[1]}`
        //   }
        // },
      ]
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: { '^/api': '' }
      }
    }
  }

};
