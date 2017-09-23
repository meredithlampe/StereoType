const webpack = require('webpack');
module.exports = {
    entry: {
        zillow: "./zillow/entry_dorkmap.js",
        yelp: "./yelp/entry_dorkmap.js",
        car2go: "./car2go/entry_dorkmap.js",
    },
    output: {
        filename: "./[name]/bundle.js"
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
