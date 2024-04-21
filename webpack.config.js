const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // Entry point for your application
    entry: './src/index.js',

    // Output configuration
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },

    // Loaders and rules
    resolve: {
        extensions: ['.js', '.json', '.ts', '.css'],
    },
    // Source map for easier debugging
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
                type: 'asset/resource',
            },

            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
        ],
    },
    // Plugins
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/mosmetro.html'
        })
    ],

    // DevServer configuration
    devServer: {
        port: 8000,
        proxy: {
            '/': {
                target: 'http://77.91.69.134',
                pathRewrite: { '': '' },
                changeOrigin: true,
                secure: false, // Set this to 'true' if your target server supports HTTPS
            },
        },
    },
};
