const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/main.tsx",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: true,
      reportFilename: "bundle-analysis.html",
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
        common: {
          name: "common",
          minChunks: 2,
          chunks: "all",
          enforce: true,
        },
      },
    },
  },
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
};
