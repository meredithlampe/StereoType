const webpack = require('webpack');
module.exports = {
    entry: {
          zillow_dorkmap: "./zillow/entry_dorkmap.js",
	  yelp_dorkmap: "./yelp/entry_dorkmap.js",
	car2go_dorkmap: "./car2go/entry_dorkmap.js",
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
