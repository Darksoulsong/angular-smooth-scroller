const webpack = require('webpack');
const conf = require('./gulp.conf');
const path = require('path');

const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const pkg = require('../package.json');
const autoprefixer = require('autoprefixer');
const uglify = process.argv.indexOf('--uglify') !== -1;
console.log(process.argv)

const config = {};
config.module = {
  loaders: [{
    test: /\.ts$/,
    exclude: /node_modules/,
    loaders: [
      'ng-annotate',
      'ts'
    ]
  }]
};
config.plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(), 
  new webpack.NoErrorsPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: {unused: true, dead_code: true, warnings: false} // eslint-disable-line camelcase
  }),
  new UnminifiedWebpackPlugin()
];
config.output = {
  path: path.join(process.cwd(), conf.paths.pack),
  // filename: '[name]-[hash].js'
  filename: '[name].min.js'
};
config.resolve = {
  extensions: [
    '',
    '.webpack.js',
    '.web.js',
    '.js',
    '.ts'
  ]
};
config.entry = {
  // app: `./${conf.path.src('index')}`,
  'angular-smooth-scroller': `./${conf.path.src('app/angular-smooth-scroller/index')}`,
};
config.ts = {
  configFileName: 'tsconfig.json'
};
config.tslint = {
  configuration: require('../tslint.json')
};

// if (uglify) {
//   console.log('Uglifying...');
//   config.plugins.push(
//     new webpack.optimize.UglifyJsPlugin({
//       compress: {unused: true, dead_code: true, warnings: false} // eslint-disable-line camelcase
//     })
//   );
//   config.entry['angular-smooth-scroller.min'] = config.entry['angular-smooth-scroller'];
// }

module.exports = config;
