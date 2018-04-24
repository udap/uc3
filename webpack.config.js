const path = require('path');
const Cleanwebpackplugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')


module.exports = {
    mode: 'development',
    entry: {
        'app': './app/src/index.js',
    },
    output: {
        filename: "[name].js",
        publicPath:"js/",
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
            },
            {
                // iconfont
                test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
                loader: 'url-loader',
            },
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader'
            }
        ]
    },
    devtool: 'cheap-module-eval-source-map',//prod env use cheap-module-source-map
    devServer:{
        contentBase:"app/public" //the index.html dir
    },
    plugins: [
        // new HtmlWebpackPlugin({template:'./app/index.html'}),
        new Cleanwebpackplugin(['dist']),
        new CopyWebpackPlugin([
            { from: path.resolve(__dirname, 'app/'), to: path.resolve(__dirname, 'dist/'), ignore: [ path.resolve(__dirname, 'app/js/') ] }

        ])
    ]
};