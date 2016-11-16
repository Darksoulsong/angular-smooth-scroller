const webpack = require('webpack');
const conf = require('./gulp.conf');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const pkg = require('../package.json');
const autoprefixer = require('autoprefixer');

module.exports = {
  module: {
    loaders: [
    //   {
    //     test: /.json$/,
    //     loaders: [
    //       'json'
    //     ]
    //   },
    //   {
    //     test: /\.(css|scss)$/,
    //     loaders: ExtractTextPlugin.extract({
    //       fallbackLoader: 'style',
    //       loader: 'css?minimize!sass!postcss'
    //     })
    //   },
      {
        test: /\.ts$/,
        // include: [
        //     path.resolve(__dirname, 'src/app/angular-smooth-scroller')
        // ],
        exclude: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'node_modules')          
        ],
        // exclude: /node_modules/,
        loaders: [
          'ng-annotate',
          'ts'
        ]
      },
    //   {
    //     test: /.html$/,
    //     loaders: [
    //       'html'
    //     ]
    //   }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    // new HtmlWebpackPlugin({
    //   template: conf.path.src('index.html')
    // }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {unused: true, dead_code: true, warnings: false} // eslint-disable-line camelcase
    // }),
    // new ExtractTextPlugin('index-[contenthash].css'),
    // new webpack.optimize.CommonsChunkPlugin({name: 'angular-smooth-scroller'})
  ], 
//   postcss: () => [autoprefixer],
  output: {
    path: path.join(process.cwd(), conf.paths.pack),
    filename: '[name]-[hash].js'
  },
  resolve: {
    extensions: [
      '',
      '.webpack.js',
      '.web.js',
      '.js',
      '.ts'
    ]
  },
  entry: {
    // app: `./${conf.path.src('index')}`,
    angularSmoothScroller: `./${conf.path.src('app/angular-smooth-scroller/index')}`,
    // vendor: Object.keys(pkg.dependencies)
  },
  ts: {
    configFileName: 'tsconfig.json'
  },
  tslint: {
    configuration: require('../tslint.json')
  }
};
