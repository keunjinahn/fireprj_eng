module.exports = {
  assetsDir: 'static',
  publicPath: '/eng',
  transpileDependencies: [
    "vuetify"
  ],
  devServer: {
    host: 'localhost',
    proxy: {
      '^/eng/api': {
        target: 'http://localhost:8081/',
        ws: true,
        changeOrigin: true,
      }
    }
  }
}