const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let outputPath = path.resolve(__dirname, '../../tutoria-server/tutoriaserver');
let outputTemplatePath = path.resolve(outputPath, './templates/tutoriaserver');
let outputStaticPath = path.resolve(outputPath, './static/tutoriaserver');

module.exports = merge(common, {

  plugins: [
    new CleanWebpackPlugin([
      outputTemplatePath,
      outputStaticPath
    ], {
      allowExternal: true
    }),
    
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../node_modules/@webcomponents/webcomponentsjs/@(webcomponents|custom-elements)*.js'),
      to: path.resolve(outputStaticPath, './[name].[ext]')
    }]),

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.ejs'),
      filename: path.resolve(outputTemplatePath, './index.html'),
      inject: false
    })
  ],

  output: {
    path: outputStaticPath,
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js'
  },

});
