const webpack = require('webpack');
const conf = require('./gulp.conf');
const path = require('path');
const fs = require("fs");

const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const pkg = require('../package.json');
const autoprefixer = require('autoprefixer');
const uglify = process.argv.indexOf('--uglify') !== -1;

const minified = {};
const stripComments = {};

function extend (from, target) {
  for (var key in from) {
    if (from.hasOwnProperty(key)) {
      target[key] = from[key];
    }
  }
}

minified.module = {
  loaders: [{
    test: /\.ts$/,
    exclude: /node_modules/,
    loaders: [
      'ng-annotate',
      'ts'
    ]
  }]
};
minified.plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(), 
  new webpack.NoErrorsPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: {unused: true, dead_code: true, warnings: false} // eslint-disable-line camelcase
  }),
  new webpack.BannerPlugin(fs.readFileSync('./LICENSE', 'utf8')),
  // new UnminifiedWebpackPlugin(),
  // new webpack.optimize.CommonsChunkPlugin({name: 'vendor'})
];
minified.output = {
  path: path.join(process.cwd(), conf.paths.pack),
  // filename: '[name]-[hash].js'
  filename: '[name].min.js'
};
minified.resolve = {
  extensions: [
    '',
    '.webpack.js',
    '.web.js',
    '.js',
    '.ts'
  ]
};
minified.entry = {
  'angular-smooth-scroller': `./${conf.path.src('app/angular-smooth-scroller/index')}`,
};
minified.ts = {
  configFileName: 'tsconfig.json'
};
minified.tslint = {
  configuration: require('../tslint.json')
};

extend(minified, stripComments);
stripComments.plugins = [ 
  new webpack.optimize.OccurrenceOrderPlugin(), 
  new webpack.NoErrorsPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    comments: false,
    beautify: true,
    mangle: false
  }),
  new webpack.BannerPlugin(fs.readFileSync('./LICENSE', 'utf8'))
];
stripComments.output = {
  path: path.join(process.cwd(), conf.paths.pack),  
  filename: '[name].js'
};

module.exports = [minified, stripComments];