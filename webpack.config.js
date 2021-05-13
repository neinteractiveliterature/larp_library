const path = require("path");
const { env } = require("process");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { DefinePlugin, ProvidePlugin } = require("webpack");

const ASSET_PATH =
  process.env.ASSET_PATH ||
  (process.env.NODE_ENV === "production"
    ? "/packs/"
    : "http://localhost:3042/packs/");

const config = {
  mode: env.NODE_ENV === "production" ? "production" : "development",
  output: {
    filename: "js/[name]-[contenthash].js",
    chunkFilename: "js/[name]-[contenthash].chunk.js",
    hotUpdateChunkFilename: "js/[id]-[hash].hot-update.js",
    assetModuleFilename: "static/[hash][ext][query]",
    path: path.resolve(__dirname, "./public/packs"),
    publicPath: ASSET_PATH,
  },
  entry: {
    application: [
      path.resolve(__dirname, "./app/javascript/packs/application.ts"),
      path.resolve(__dirname, "./app/javascript/packs/application.scss"),
    ],
  },
  devServer: {
    port: 3042,
    headers: { "Access-Control-Allow-Origin": "*" },
    static: false,
  },
  resolve: {
    extensions: [".js", ".mjs", ".ts", ".tsx", ".coffee"],
    modules: [path.resolve(__dirname, "./app/javascript"), "node_modules"],
  },
  devtool: "cheap-module-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new WebpackManifestPlugin(),
    new MiniCssExtractPlugin(),
    new DefinePlugin({
      "process.env.ASSET_PATH": JSON.stringify(ASSET_PATH),
    }),
    new ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
  ],
};

module.exports = config;
