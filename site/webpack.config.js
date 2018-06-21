const path = require('path');
const webpack = require('webpack');
const yargs = require('yargs');

const args = yargs.argv;
const contextPath = path.join(__dirname, '.');
const publicPath = path.join(__dirname, 'public');

module.exports = {
  context: contextPath,
  devServer: {
    compress: true,
    contentBase: publicPath,
    historyApiFallback: true,
    open: true
  },
  devtool: args.p ? false : 'source-map',
  entry: './index.js',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              'transform-decorators-legacy',
              ['transform-react-jsx', { pragma: 'h' }],
              'transform-skate-flow-props'
            ],
            presets: ['env', 'flow', 'react', 'stage-0']
          }
        }
      },
      {
        test: /\.(html)/,
        loaders: 'file-loader?{ name: "[path][name].[ext]"}'
      },
      {
        test: /\.(png)/,
        loaders: ['file-loader', 'img-loader']
      },
      {
        test: /\.worker\.js$/,
        loaders: 'worker-loader'
      }
    ]
  },
  optimization: {
    splitChunks: {}
  },
  output: {
    path: publicPath,
    publicPath: '/'
  }
};
