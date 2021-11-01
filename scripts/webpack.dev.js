const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base');
const portfinder = require('portfinder');
const path = require('path');
const { BASE_PORT } = require('./utils/constant');

portfinder.basePort = BASE_PORT;

const devConfig = {
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, '../public/index.html')
    },
    hot: true,
    // 是否开启代码压缩
    compress: true,
    port: BASE_PORT
  }
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