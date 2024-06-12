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
        index: "./website/scripts/index.ts",
        home: "./website/scripts/home.ts",
        register: "./website/scripts/register.ts",
        chat: "./website/scripts/chat.ts",
        createProject: "./website/scripts/create-project.ts",
        project: "./website/scripts/project.ts",
        profile: "./website/scripts/profile.ts",
    },
    output: {
        path: path.resolve(__dirname,"website","scripts", "dist"),
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