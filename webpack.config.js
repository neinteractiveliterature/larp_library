/* eslint-disable @typescript-eslint/no-var-requires */
/* global require, process, __dirname, module */

const path = require('path');
const { env } = require('process');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { DefinePlugin } = require('webpack');

const ASSET_PATH =
  process.env.ASSET_PATH ||
  (process.env.NODE_ENV === 'production' ? '/packs/' : 'http://localhost:3042/packs/');

const config = {
  mode: env.NODE_ENV === 'production' ? 'production' : 'development',
  output: {
    filename: 'js/[name]-[contenthash].js',
    chunkFilename: 'js/[name]-[contenthash].chunk.js',
    hotUpdateChunkFilename: 'js/[id]-[fullhash].hot-update.js',
    assetModuleFilename: 'static/[name]-[contenthash][ext][query]',
    path: path.resolve(__dirname, './public/packs'),
    publicPath: ASSET_PATH,
  },
  entry: {
    application: [
      path.resolve(__dirname, './app/javascript/packs/application.tsx'),
      path.resolve(__dirname, './app/javascript/packs/application.scss'),
    ],
  },
  devServer: {
    port: 3042,
    headers: { 'Access-Control-Allow-Origin': '*' },
    static: false,
  },
  resolve: {
    extensions: ['.js', '.mjs', '.ts', '.tsx'],
    modules: [path.resolve(__dirname, './app/javascript'), 'node_modules'],
    alias: {
      'react/jsx-dev-runtime': 'react/jsx-dev-runtime.js',
      'react/jsx-runtime': 'react/jsx-runtime.js',
    },
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
        type: 'asset',
      },
    ],
  },
  plugins: [
    new WebpackManifestPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name]-[contenthash].css',
    }),
    new DefinePlugin({
      'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
    }),
  ],
};

if (process.env.ANALYZE_BUNDLE_SIZE) {
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
  config.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = config;
