const path = require('path');
const base = path.resolve(__dirname, '..', 'public');

module.exports = {
  devServer: {
    contentBase: base,
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
    chunkFilename: '[name].bundle.js',
    filename: 'index.js',
    path: base,
    publicPath: '/'
  }
};
