var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;

var dev = process.env.NODE_ENV === 'dev';

// I use this variable for my weird version-based
// cache-busting mechanism.
var vers = require("./package.json").version.replace(/\./g, "_");
var quotedVers = "'" + vers + "'";

var config = {
  entry: {
    app: './src/app.js',
    about: './src/about.js',
    contact: './src/contact.js',
    hireme: './src/hireme.js',
    articles: './src/articles.js',
    article: './src/article.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'scripts/[name]' + vers + '.js',
    chunkFilename: 'fragments/[name][hash].js',
    publicPath: '/'
  },
  module: {
    rules: [
      // This loader will inline CSS in the JS.
      // Reduces the amount of required requests
      // but creates a big FOUC.
      /*{
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader'
        ]
      },*/
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4500,
              name: './img/[name][hash:7].[ext]'
            }
          },
          {
            loader: 'img-loader',
            options: {
              plugins: dev || [
                require('imagemin-gifsicle')({
                  interlaced: false
                }),
                require('imagemin-mozjpeg')({
                  progressive: true,
                  arithmetic: false
                }),
                require('imagemin-pngquant')({
                  quality: '80-95',
                  speed: 1
                })
              ]
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: './fonts/[name][hash:7].[ext]'
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ],
        include: [
          path.resolve(__dirname, 'src/fragments')
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      scriptLoading: "defer",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      chunks: ['app']
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'assets', to: 'assets' },
        { from: 'webroot', to: '' },
        //{from: 'wp-content', to: 'wp-content'}
      ]
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name][contenthash].css'
    }),
    new webpack.DefinePlugin({
      VERSION: quotedVers
    })
  ],
  devServer: {
    port: 8081,
    historyApiFallback: true
    //publicPath: '/'
  }
}

if (dev) {
  config.devtool = 'eval-source-map';
  //config.plugins[0].minify = false;
} else {
  config.plugins.push(new CleanWebpackPlugin());
}

module.exports = config;
