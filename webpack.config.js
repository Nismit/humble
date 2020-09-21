const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = (env, argv) => ({
  entry: {
    bundle: './src/js/index.js'
  },

  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'static/js/')
  },

  devtool: argv.mode === 'production' ? 'none' : 'source-map',

  performance: {
    maxEntrypointSize: 1000000
  },

  devServer: {
    contentBase: path.join(__dirname, 'static'),
    compress: true,
    port: 8080
  },

  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },

  module: {
    rules: [
      {
        test: /\.scss/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: argv.mode === 'production' ? false : true,
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
                sourceMap: argv.mode === 'production' ? false : true,
                postcssOptions: {
                    plugins: [
                        require('autoprefixer')({
                            grid: true // CSS Grid Layout
                        })
                    ],
                },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sourceMap: argv.mode === 'production' ? false : true
            }
          }
        ]
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { 'modules': 'commonjs' }]  // "modules" true, it will be converted to CommonJS
              ]
            }
          }
        ],
        exclude: /node_modules/,
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '../css/style.css'
    })
  ]
});
