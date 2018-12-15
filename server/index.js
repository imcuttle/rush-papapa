/**
 * @file index
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 12/12/2018
 *
 */
const http = require('http')
const { parse } = require('url')
const getPort = require('get-port')
const openEditor = require('../open-editor')

module.exports = function setup(port) {
  return Promise.resolve()
    .then(() => {
      if (!port) {
        return getPort()
      }
      return port
    })
    .then(port => {
      const server = http.createServer(function(req, res) {
        const obj = parse(req.url, true)
        if (obj.query.pos) {
          const editor = obj.query.editor
          openEditor([obj.query.pos], {
            editor
          })
        }
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.end()
      })
      server.listen(port)

      return port
    })
}
