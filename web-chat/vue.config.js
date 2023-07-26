const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/my-project',
  devServer: {
    historyApiFallback: {
      rewrites: [
        { from: /^\/my-project\/.*$/, to: '/my-project/index.html' } // 将所有以/my-project/开头的请求重定向到index.html
      ]
    }
  }
})
