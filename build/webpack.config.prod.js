const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const baseWebpackConfig = require('./webpack.config.base');

module.exports = merge(baseWebpackConfig, {
  devtool: 'source-map',
  output: {
    filename: 'static/[name].[chunkhash:8].js',
    chunkFilename: 'static/[name].[chunkhash:8].chunk.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: {
            loader: 'style-loader',
            options: {
              hmr: false,
            }
          },
          use: [
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
                minimize: true,
                sourceMap: true,
              }
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                ident: 'postcss',
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  autoprefixer({
                    browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'ie <= 9',
                    ],
                    flexbox: 'no-2009',
                  })
                ]
              }
            }
          ]
        })
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([{
      context: '../public',
      from: '*',
      ignore: ['index.html']
    }]),
    new webpack.DefinePlugin({
      'process.env': 'production'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true,
      parallel: true
    }),
    new ExtractTextPlugin({
      filename: 'static/[name].[contenthash:8].css',
      allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    })
  ]
});
