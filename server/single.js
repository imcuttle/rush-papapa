/**
 * @file single
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 12/12/2018
 *
 */

const cp = require('child_process')
const nps = require('path')
const fs = require('fs')

const PID_PATH = nps.join(__dirname, '../PID')
const PORT_PATH = nps.join(__dirname, '../PORT')

function readPid() {
  try {
    return fs.readFileSync(PID_PATH).toString()
  } catch (_) {}

  return null
}

function readPort() {
  try {
    return fs.readFileSync(PORT_PATH).toString()
  } catch (_) {}

  return null
}

function writePid(pid) {
  fs.writeFileSync(PID_PATH, String(pid))
}

function run(port) {
  kill()
  const child = cp.fork(require.resolve('./run-server.js'), [port || ''])
  child.unref()

  writePid(child.pid)
}

function kill() {
  const pid = readPid()

  if (pid) {
    try {
      process.kill(pid)
    } catch (e) {}
    writePid('')
  }
}

module.exports = {
  run,
  kill,
  readPort,
  readPid,
  writePid
}
