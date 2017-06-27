const webpack = require('webpack');
module.exports = {
      entry: ["./js/GridCache.js", "./entry.js"
            ],
        output: {
                filename: "bundle.js"
        },
    plugins: [
        new webpack.DefinePlugin({
            __DEV__: process.env !== 'production',
        })
    ]
}
