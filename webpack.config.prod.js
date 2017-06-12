// For info about this file refer to webpack and webpack-hot-middleware documentation
// For info on how we're generating bundles with hashed filenames for cache busting: https://medium.com/@okonetchnikov/long-term-caching-of-static-assets-with-webpack-1ecb139adb95#.w99i89nsz
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';
import autoprefixer from 'autoprefixer';
import path from 'path';

import {buildEntries, htmlPluginProd} from './tools/webpack.util';
import pages from './src/webpack-entries';

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production'),
  __DEV__: false
};


export default {
  resolve: {
    extensions: ['*', '.js', '.json']
  },
  devtool: 'source-map', // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
  entry: buildEntries(pages),
  target: 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name]/[name].[chunkhash].js'
  },
  plugins: [
    // Hash the files using MD5 so that their names change when the content changes.
    new WebpackMd5Hash(),

    // Tells React to build in prod mode. https://facebook.github.io/react/downloads.html
    new webpack.DefinePlugin(GLOBALS),

    /*
     *inject es5 modules as global vars. Required for bootstrap build
     * https://github.com/IdanCo/webpack-modular/blob/bootstrap4/conf/webpack.base.config.js
     */
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Tether: 'tether'
    }),

    // Generate an external css file with a hash in the filename
    new ExtractTextPlugin('[name]/[name].[contenthash].css'),

    ...htmlPluginProd(pages),

    // Minify JS
    new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),

    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      noInfo: true, // set to false to see a list of every file being bundled.
      options: {
        context: '/',
      }
    })
  ],
  module: {
    rules: [
      {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader'},
      {test:/\.html$/, use:[{loader: 'html-loader'}]},
      {test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'url-loader?name=[name].[ext]'},
      {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff&name=[name].[ext]'},
      {test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream&name=[name].[ext]'},
      {test: /\.svg(\?v=\d+.\d+.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml&name=[name].[ext]'},
      {test: /\.(jpe?g|png|gif)$/i, loader: 'file-loader?name=[name].[ext]'},
      {test: /\.ico$/, loader: 'file-loader?name=[name].[ext]'},
      {
        test: /(\.css|\.scss|\.sass)$/,
        loader: ExtractTextPlugin.extract({
          loader:[
            {
              loader:'css-loader',
              options:{
                sourceMap:true,
                modules: false
              }
            },
            {
              loader: 'postcss-loader',
              options:{
                sourceMap: true,
                plugins:()=>[
                  autoprefixer()
                ]
              }
            },
            {
              loader: 'sass-loader',
              options:{
                sourceMap:true,
                includePaths: [path.resolve(__dirname, 'src', 'scss')]
              }
            }
          ]
        })
      }
    ]
  }
};
