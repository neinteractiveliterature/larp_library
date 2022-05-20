/* eslint-disable @typescript-eslint/no-var-requires */
/* global require, process, __dirname, module */

const path = require('path');
const { env } = require('process');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { DefinePlugin, ProvidePlugin } = require('webpack');

const ASSET_PATH =
  process.env.ASSET_PATH || (process.env.NODE_ENV === 'production' ? '/packs/' : 'http://localhost:3042/packs/');

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
    fallback: {
      assert: require.resolve('assert/'),
      process: require.resolve('process/browser'),
    },
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: require.resolve('babel-loader'),
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, require.resolve('css-loader'), require.resolve('sass-loader')],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, require.resolve('css-loader')],
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
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
      'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
    }),
    new ProvidePlugin({
      process: require.resolve('process/browser'),
    }),
  ],
};

if (process.env.ANALYZE_BUNDLE_SIZE) {
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
  config.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = config;
