const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base');
const portfinder = require('portfinder');
const path = require('path');
const { BASE_PORT } = require('./utils/constant');
const ESLintPlugin = require('eslint-webpack-plugin')

portfinder.basePort = BASE_PORT;

const devConfig = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, '../public')
    },
    hot: true,
    // 是否开启代码压缩
    compress: true,
    port: BASE_PORT,
    // 代理
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
  plugins: [
    new ESLintPlugin({
      context: path.resolve(__dirname, '../'),
      fix: true,
      files: 'src',
      extensions: ['js', 'jsx', 'ts', 'tsx'],
    }),
  ],
}

module.exports = async function () {
  try {
    /** 端口被占用时候 portfinder.getPortPromise 返回一个新的端口(往上叠加) */
    const port = await portfinder.getPortPromise();
    devConfig.devServer.port = port;
    return merge(devConfig, baseConfig);
  } catch (e) {
    throw new Error(e);
  }
}