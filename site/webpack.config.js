module.exports = {
  devServer: {
    contentBase: '../public'
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
            presets: ['env', 'flow', 'react', 'stage-0'],
            plugins: [['transform-react-jsx', { pragma: 'h' }]]
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
    filename: '../public/index.js',
    path: `${__dirname}/../public`
  }
};
