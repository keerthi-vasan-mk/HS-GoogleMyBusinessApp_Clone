const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');

const parts = require('./webpack.parts');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');

// Environment constants
const ENV = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  STAGING: "staging",
  LOCAL: "local",
};

// Path constants
const PATHS = {
  src: path.join(__dirname, "src"),
  entry: path.join(__dirname, "src", "index.js"),
  modal_entry: path.join(__dirname, "src", "modal", "index.js"),
  public: path.join(__dirname, "public"),
  template: path.join(__dirname, "public", "index.html"),
  modal_template: path.join(__dirname, "public", "modal_index.html"),
  build: path.join(__dirname, "build"),
  node_modules: path.join(__dirname, "node_modules"),
};

// File naming conventions
const BUILD_FILE_NAMES = {
  css: "style/[name].[contenthash:4].css",
  bundle: "js/bundle-[name].[chunkhash:4].js",
  vendor: "js/vendor.[chunkhash:4].js",
  assets: "assets/[name].[hash:4].[ext]",
};

// Path aliases for easier imports. Very important, do not remove
const PATH_ALIASES = {
  "@": path.resolve(__dirname, "src"),
  "assets": path.resolve(__dirname, "src", "assets"),
};

// Asset path (for CDN or subdirectory deployments)
const ASSET_PATH = process.env.ASSET_PATH || "/";

// Common configuration shared across all environments
const commonConfig = merge([
  {
    entry: {
      main: PATHS.entry,
      modal: PATHS.modal_entry,
    },
    output: {
      path: PATHS.build,
      publicPath: ASSET_PATH,
      filename: BUILD_FILE_NAMES.bundle,
      chunkFilename: BUILD_FILE_NAMES.vendor,
    },
    resolve: {
      alias: PATH_ALIASES,
      extensions: [".js", ".jsx", ".json"],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: PATHS.template,
        chunks: ["main"],
        filename: "index.html",
      }),
      new HtmlWebpackPlugin({
        template: PATHS.modal_template,
        chunks: ["modal"],
        filename: "modal_index.html",
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: "static",
        openAnalyzer: false,
      }),
    ],
  },
  parts.loadJS({ include: PATHS.src }),
  parts.loadFonts({
    exclude: path.join(PATHS.src, "assets", "images"),
    options: { name: BUILD_FILE_NAMES.assets },
  }),
]);

// Environment-specific configuration
const getEnvConfig = (env) => {
  const isDev = env === ENV.DEVELOPMENT || env === ENV.LOCAL;
  const isProd = env === ENV.PRODUCTION || env === ENV.STAGING;

  return merge([
    {
      output: {
        filename: isDev ? "[name].js" : BUILD_FILE_NAMES.bundle,
      },
    },
    // Set environment variables
    isDev && parts.setEnvironmentVariable(ENV.DEVELOPMENT, env, ASSET_PATH),
    isProd && parts.setEnvironmentVariable(ENV.PRODUCTION, env, ASSET_PATH),
    // Generate source maps in development
    isDev && parts.generateSourceMaps({ type: "eval-source-map" }),
    // Load CSS
    parts.loadCSS({ theme: path.join(PATHS.src, "styles", "settings", "theme.scss") }),
    // Load images
    parts.loadImages({
      exclude: path.join(PATHS.src, "assets", "fonts"),
      ...(isProd && {
        urlLoaderOptions: { limit: 10 * 1024, name: BUILD_FILE_NAMES.assets },
        fileLoaderOptions: { name: BUILD_FILE_NAMES.assets },
        imageLoaderOptions: {
          mozjpeg: { progressive: true, quality: 40 },
          pngquant: { quality: "50-60", speed: 4 },
        },
      }),
    }),
    // Clean build directory in production
    isProd && parts.clean(PATHS.build),
    // Extract CSS in production
    isProd && parts.extractCSS({ filename: BUILD_FILE_NAMES.css, theme: path.join(PATHS.src, "styles", "settings", "theme.scss") }),
    // Optimize CSS in production
    isProd && parts.CSSOptimization({ discardComments: { removeAll: true }, safe: true }),
    // Enable gzip compression in production
    isProd && parts.gZipCompression(),
    // Extract manifest in production
    isProd && parts.extractManifest(),
    // Copy public files to build directory
    parts.copy(PATHS.public, path.join(PATHS.build, "public")),
    // Dev server configuration for development
    isDev &&
      parts.devServer({
        host: process.env.HOST || "localhost",
        port: process.env.PORT || 3000,
      }),
  ].filter(Boolean));
};

// Export the final Webpack configuration
module.exports = (mode) => {
  const webpackMode = mode === ENV.PRODUCTION || mode === ENV.STAGING ? "production" : "development";
  return merge(commonConfig, getEnvConfig(mode), { mode: webpackMode });
};