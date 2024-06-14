const path = require("path");
const webpack = require('webpack');

module.exports = {
    devtool: "source-map",
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ],
    entry: {
        index: "./scripts/index.ts",
        home: "./scripts/home.ts",
        register: "./scripts/register.ts",
        chat: "./scripts/chat.ts",
        createProject: "./scripts/create-project.ts",
        project: "./scripts/project.ts",
        profile: "./scripts/profile.ts",
    },
    output: {
        path: path.resolve(__dirname,"scripts", "dist"),
        filename: "[name].bundle.js",
        clean: true,
    },
    module: {
        rules: [
            // Add rules to handle TypeScript files
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
        fallback: {
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            vm: require.resolve('vm-browserify'),
            util: require.resolve('util/')
        },
    },
};