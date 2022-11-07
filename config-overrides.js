const webpack = require('webpack');
const Dotenv = require('dotenv-webpack'); 
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = function override(config, env) {
  const fallback = config.resolve.fallback || {};
    config.resolve.fallback = fallback;
    config.ignoreWarnings = [/Failed to parse source map/];
    return {
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader"
                }
            },
            {
                test: /\.(ts|tsx)?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            
            {
                test: /\.(graphql|gql)$/,
                exclude: /node_modules/,
                loader: 'graphql-tag/loader',
              },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
                exclude: /node_modules/,
                use: ['file-loader?name=[name].[ext]'] // ?name=[name].[ext] is only necessary to preserve the original file name
            },
            {
                test: /\.json$/,
                exclude: /node_modules/,
                loader: 'json-loader'
            },
            {
                test: /\.m?js/,
                exclude: /node_modules/,
                type: "javascript/auto",
            },
        ],
    },
    mode: "production",
    performance: {
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
   },
   stats: {
    children: true,
    errorDetails: true
   },
   entry: {
    "app": "./src/index.js"
    },
    devtool: "source-map",
    resolve: { 
        extensions: [".tsx", ".ts", ".js",".jsx",".json"], 
        fallback: {
        'process/browser': require.resolve('process/browser'), 
        fs: false,    
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "stream": require.resolve("stream-browserify"),
        "buffer": require.resolve('buffer/'),
        "crypto": require.resolve("crypto-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "url": require.resolve("url"),
        "assert": require.resolve("assert"),
        },alias: {
        process: "process/browser"
        },
    },
    output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    },
    plugins: [
        new Dotenv({
            systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
          }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser'
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: './index.html',
            favicon: './public/favicon.ico'
          }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV' : JSON.stringify('production')
          }),
    ]
};

};