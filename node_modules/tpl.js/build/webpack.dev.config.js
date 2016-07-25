var path = require('path'),
  webpack = require('webpack'),
  pkg = require('../package.json'),
  bannar = `${pkg.name} v${pkg.version} built in ${new Date().toUTCString()}
Copyright (c) 2016 ${pkg.author}
Based on observer.js v0.2.x
Released under the ${pkg.license} license
support IE6+ and other browsers
support ES6 Proxy and Object.observe
${pkg.homepage}`;

var devServer = {
  host: 'localhost',
  port: 8088
};

var config = {
  devServer: devServer,
  entry: {
    tpl: path.resolve(__dirname, '../src/index.js')
  },
  output: {
    publicPath: `http://${devServer.host}:${devServer.port}/dist/`,
    contentBase: path.resolve(__dirname, '../'),
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd'
  },
  externals: {
    observer: {
      root: 'observer',
      commonjs: 'observer',
      commonjs2: 'observer',
      amd: 'observer'
    },
    jquery: {
      root: 'jQuery',
      commonjs: 'jquery',
      commonjs2: 'jquery',
      amd: 'jquery'
    }
  },
  resolve: {
    modulesDirectories: [path.resolve(__dirname, '../node_modules')],
    extensions: ['', '.js'],
    alias: {
      'observer': 'observer.js'
    }
  },
  module: {
    loaders: [{
      test: /\.(js)$/,
      loader: 'babel'
    }]
  },
  plugins: [new webpack.BannerPlugin(bannar)],
  devtool: 'source-map'
}

module.exports = config;
