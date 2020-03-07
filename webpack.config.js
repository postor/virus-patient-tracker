const path = require("path"); // eslint-disable-line
const HtmlWebpackPlugin = require("html-webpack-plugin"); // eslint-disable-line
module.exports = {
  entry: path.join(__dirname, "web", "index.js"),
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "index.bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: ["@babel/plugin-proposal-object-rest-spread", "@babel/transform-runtime"],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|eot|svg|woff2|ttf|woff)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
        options: {
          outputPath: "public",
          publicPath: "public",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "web/index.html",
    }),
  ],
};
