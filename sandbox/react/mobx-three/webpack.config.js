var debug = process.env.NODE_ENV !== 'production';
var webpack = require('webpack')
var path = require('path')

module.exports = {
    context: path.join(__dirname, 'src'),
    devtool: debug ? "inline-sourcemap" : null,
    entry: './js/index.js',
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules)|(bower_components)/,
            loader: 'babel-loader',
        }, {
          test: /\.glsl$/,
          exclude: /(node_modules)|(bower_components)/,
          loader: 'glsl-template-loader',
        }]
    },
    output: {
        path: `${__dirname}/src`,
        filename: 'bundle.js',
    },
    plugins: debug ? [] : [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            mangle: false,
            sourcemap: false
        })
    ]
}
