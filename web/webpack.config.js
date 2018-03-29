module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    './src/main.js'
  ],
  resolve: {
    modules: [
      __dirname + '/src',
      __dirname + '/node_modules'
    ]
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/js',
    filename: '[name].bundle.js'
  },
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['react-hot-loader','babel-loader']
      },
      {
        test: /\.css?$/,
        exclude: /node_modules/,
        use: ['style-loader','css-loader']
      },
      {
        test: /\.scss?$/,
        exclude: /node_modules/,
        use: ['style-loader','css-loader','sass-loader']
      }
    ]
  },
};