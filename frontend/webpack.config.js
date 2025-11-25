const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/app.js',
    mode: 'development',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9000,
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext][query]'
                }
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin(
            {
                template: "./index.html",
            }),
        new CopyPlugin({
            patterns: [
                {from: "./src/templates", to: "templates"},
                {from: "./node_modules/bootstrap/dist/css/bootstrap.min.css", to: "css"},
                {from: "./node_modules/bootstrap-icons/font/bootstrap-icons.min.css", to: "css"},
                {from: "./node_modules/chart.js/dist/chart.umd.min.js", to: "js"},
                {from: "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", to: "js"},
                {from: "./node_modules/bootstrap-icons/font/fonts", to: "css/fonts"}
            ],
        }),
    ],
};