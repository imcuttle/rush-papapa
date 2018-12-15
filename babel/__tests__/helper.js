/**
 * @file helper
 */

const nps = require('path')
const fs = require('fs')

function fixture() {
  return nps.join.apply(nps, [__dirname, 'fixture'].concat([].slice.call(arguments)))
}

function readFile(name) {
  return fs.readFileSync(fixture(name))
}

module.exports = {
  fixture,
  readFile
}
