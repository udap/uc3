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
        filename: "[name].[hash:5].js",
        // publicPath:"js/", script src Prefix <script type="text/javascript" src="js/app.8aa23.js"></script></body>
        path: path.resolve(__dirname, 'dist')
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
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/,
            }
        ]
    },
    devtool: 'cheap-module-eval-source-map',//prod env use cheap-module-source-map
   /*devServer:{
        contentBase:"app/public" //the index.html dir
    },*/
    plugins: [
        new HtmlWebpackPlugin({template:'./app/public/index.html'}),
        new Cleanwebpackplugin(['dist'])/*,
        new CopyWebpackPlugin([
            { from: path.resolve(__dirname, 'app/'), to: path.resolve(__dirname, 'dist/'), ignore: [ path.resolve(__dirname, 'app/js/') ] }
        ])*/
    ]
};