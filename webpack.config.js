const path = require('path');
const context = path.join(__dirname, 'site');
const public = path.join(__dirname, 'public');
const webpack = require('webpack');

module.exports = {
  context,
  devServer: {
    contentBase: public,
    historyApiFallback: true,
    open: true
  },
  devtool: 'source-map',
  entry: './index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              ['transform-react-jsx', { pragma: 'h' }],
              'transform-skate-flow-props'
            ],
            presets: ['env', 'flow', 'react', 'stage-0']
          }
        }
      },
      {
        test: /\.(html|png)/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]'
          }
        }
      }
    ]
  },
  output: {
    filename: '[name].js',
    path: public,
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'main',
      minChunks: 2,
      children: true,
      deepChildren: true
    })
  ]
};
