const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let outputPath = path.resolve(__dirname, '../out');

module.exports = merge(common, {
  
  plugins: [
    new CleanWebpackPlugin([
      outputPath
    ]),
    
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../node_modules/@webcomponents/webcomponentsjs/@(webcomponents|custom-elements)*.js'),
      to: path.resolve(outputPath, './[name].[ext]')
    }]),

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.ejs'),
      filename: path.resolve(outputPath, './index.html'),
      inject: false
    })
  ],

  output: {
    path: outputPath,
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js'
  },

  devServer: {
    host: '0.0.0.0',
    contentBase: outputPath,
    historyApiFallback: {
      rewrites: [
        {
          from: /^\/static\/(.*)$/,
          to: function(context) {
            return `/${context.match[1]}`
          }
        },
      ]
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000'
      }
    }
  }

});
