var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var dev = process.env.NODE_ENV === 'dev';

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
    filename: 'scripts/[name].js',
    chunkFilename: 'fragments/[name][hash].js',
    publicPath: '/'
  },
  module: {
    loaders: [
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
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: './img/[name][hash:7].[ext]'
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
      chunks: ['app']
    }),
    new CopyWebpackPlugin([
      {from: 'assets', to: 'assets'},
      {from: 'webroot', to: ''},
      //{from: 'wp-content', to: 'wp-content'}
    ]),
    new ExtractTextPlugin("styles/[name].[contenthash].css")
  ],
  devServer: {
    port: 8080,
    historyApiFallback: true,
    publicPath: '/'
  }
}

if (dev) {
  config.devtool = 'eval-source-map';
} else {
  config.plugins.push(new CleanWebpackPlugin(['dist']));
}

module.exports = config;

