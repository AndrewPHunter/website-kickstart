import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import path from 'path';

import {buildEntries, htmlPluginDev} from './tools/webpack.util';
import pages from './src/webpack-entries';

const webpackDev = [
  './src/webpack-public-path',
  'react-hot-loader/patch',
  'webpack-hot-middleware/client?reload=true'
];

export default {
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json']
  },
  devtool: 'eval-source-map', // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
  entry: buildEntries(pages, webpackDev),
  target: 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
  output: {
    path: path.resolve(__dirname, 'dist'), // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: '[name]/[name].bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'), // Tells React to build in either dev or prod modes. https://facebook.github.io/react/downloads.html (See bottom)
      __DEV__: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
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
    ...htmlPluginDev(pages),
    new webpack.LoaderOptionsPlugin({
      minimize: false,
      debug: true,
      noInfo: true, // set to false to see a list of every file being bundled.
      options: {
        context: '/',
      }
    })
  ],
  module: {
    rules: [
      {test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel-loader']},
      {test:/\.html$/, use:[{loader: 'html-loader'}]},
      {test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader'},
      {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff'},
      {test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml'},
      {test: /\.(jpe?g|png|gif)$/i, loader: 'file-loader?name=[name].[ext]'},
      {test: /\.ico$/, loader: 'file-loader?name=[name].[ext]'},
      {
        test: /(\.css|\.scss|\.sass)$/,
        use: [
          {loader: 'style-loader'},
          {
            loader:'css-loader',
            options:{
              sourceMap:true,
              modules: false,
              importLoaders: 2,
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
      }
    ]
  }
};
