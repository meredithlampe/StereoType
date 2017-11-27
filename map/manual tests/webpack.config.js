const webpack = require('webpack');
module.exports = {
      entry: ["./main.js"
            ],
        output: {
                filename: "bundle.js"
        },
    node: {
	fs: 'empty',
	net: 'empty',
	tls: 'empty',
	child_process: 'empty',
    }
}
