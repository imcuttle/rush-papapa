/**
 * @file index
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 12/12/2018
 *
 */
const nps = require('path')
const fs = require('fs')

const PORT_PATH = nps.join(__dirname, '../PORT')
const server = require('./index')

return server(process.argv[2]).then(port => {
  fs.writeFileSync(PORT_PATH, String(port))
  return port
})
