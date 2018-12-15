/**
 * @file match
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 12/12/2018
 *
 */
const pm = require('picomatch')

module.exports = function match(value, rule) {
  if (typeof rule === 'string') {
    return pm(rule)(value)
  }
  if (rule instanceof RegExp) {
    return !!rule.exec(value)
  }
  if (typeof rule === 'function') {
    return !!rule(value)
  }
  if (Array.isArray(rule)) {
    return rule.some(r => match(value, r))
  }
  return false
}
