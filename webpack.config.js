module.exports = {
  devtool: 'source-map',
  entry: './site/public.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  node: {
    fs: 'empty'
  },
  output: {
    filename: './public/index.js'
  }
};
