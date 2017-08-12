const webpack = require('webpack');
module.exports = {
    entry: {
          zillow: "./entry.js"
      },
        output: {
                filename: "[name]_bundle.js"
        },
    plugins: [
        new webpack.DefinePlugin({
            __DEV__: process.env !== 'production',
        })
    ],
    node: {
          fs: 'empty'
    }
}
