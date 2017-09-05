const webpack = require('webpack');
module.exports = {
    entry: {
          zillow: "./entry.js",
          zillow_dorkmap: "./entry_dorkmap.js",
	  test_one_shape: "./test_one_shape.js"

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
