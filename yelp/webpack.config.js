const webpack = require('webpack');
module.exports = {
    entry: {
          yelp: "./entry.js",
          yelp_dorkmap: "./entry_dorkmap.js"

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
