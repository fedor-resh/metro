const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // Entry point for your application
    entry: './index.js',

    // Output configuration
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },

    // Loaders and rules
    resolve: {
        extensions: ['.js', '.json', '.ts'],
    },
    // Source map for easier debugging
    devtool: 'inline-source-map',
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
            template: './mosmetro.html'
        })
    ],

    // DevServer configuration
    devServer: {
        compress: true,
        port: 9000,
        historyApiFallback: true, // If using client-side routing
    },

    // Additional configurations if needed
};
