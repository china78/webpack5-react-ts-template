const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { separator } = require('./utils/constant');
const { getEntryTemplate } = require('./utils/helper');

/** 将packages拆分为数组 ['editor', 'main'] */
const packages = process.env.packages.split(separator);

/** 调用getEntryTemplate 获得对应的entry和htmlPlugins */
const { entry, htmlPlugins } = getEntryTemplate(packages);

module.exports = {
  entry,
  // entry: {
  //   main: path.resolve(__dirname, '../src/packages/main/index.tsx'),
  //   editor: path.resolve(__dirname, '../src/packages/editor/index.tsx')
  // },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, '../src'),
      '@packages': path.resolve(__dirname, '../src/packages'),
      '@containers': path.resolve(__dirname, '../src/containers'),
      '@layout': path.resolve(__dirname, '../src/layout'),
      '@utils': path.resolve(__dirname, '../src/utils'),
      '@styles': path.resolve(__dirname, '../src/styles'),
    },
    mainFiles: ['index', 'main'],
    extensions: ['.ts', '.tsx', '.scss', '.json', '.js']
  },
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        use: 'babel-loader'
      },
      {
        test: /\.css/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.(sa|sc|le)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              modules: true
            },
          },
          'postcss-loader',
          {
            loader: 'resolve-url-loader',
            options: {
              keepQuery: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        type: 'asset/inline'
      },
      {
        test: /\.svg$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024, // 4kb
          },
        },
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]'
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/[name].css'
    }),
    // new HtmlWebpackPlugin({
    //   filename: 'main.html',
    //   template: path.resolve(__dirname, '../public/index.html'),
    //   chunks: ['main']
    // }),
    // new HtmlWebpackPlugin({
    //   filename: 'editor.html',
    //   template: path.resolve(__dirname, '../public/index.html'),
    //   chunks: ['editor']
    // })
    ...htmlPlugins
  ]
}