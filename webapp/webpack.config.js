
var path = require('path');

module.exports = {
    entry: [
        './src/index.jsx'
    ],
    resolve: {
        modules: [
            'src',
            'node_modules',
            path.resolve(__dirname)
        ],
        extensions: ['*', '.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'react'],
                        plugins: [
                            'transform-class-properties',
                            'transform-object-rest-spread'
                        ]
                    }
                }
            }
        ]
    },
    externals: {
        react: 'React',
        redux: 'Redux',
        'react-redux': 'ReactRedux'
    },
    output: {
        path: path.join(__dirname, '/dist'),
        publicPath: '/',
        filename: 'main.js'
    }
};