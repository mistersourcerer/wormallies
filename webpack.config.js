const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const server = {
  target: 'node',
  entry: './src/server.js',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    // Well.. here we go, this is actually to be sure that
    // the client starts on port 9000.
    // Why it has to be here in the first config?
    // Your guess is as good as mine.
    // #TODO: understand why and fix it (bringing the config to the client)
    port: 9000
  },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}

const client = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.ejs',
      filename: 'index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(c|s[ac])ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  }
}

module.exports = [server, client]
