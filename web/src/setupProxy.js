const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://server:8081',
      pathRewrite: { '^/api': '' },
      changeOrigin: true,
    })
  )
}
