const path = require('path');
const Cleanwebpackplugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        'home-issue':'./app/js/home-issue.js',
        'home-test': './app/js/home-test.js',
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, 'dist/js')
    },
    module: {
        rules: [
            {
                test: /\.css$/, //load css
                use: [
                    {loader: 'style-loader' },
                    {loader: 'css-loader'}
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,  //loade img
                use: [
                    {
                        loader: 'url-loader',
                        options:{
                            limit:8192
                        }

                    }
                ]
            }
        ]
    },
    devServer:{
        contentBase:"app" //the index.html dir
    },
    plugins: [
        // new HtmlWebpackPlugin({template : './index.html'}),
        new Cleanwebpackplugin(['dist'])
    ]
};