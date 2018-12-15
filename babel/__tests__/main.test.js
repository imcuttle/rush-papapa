/**
 * @file main
 * @author imcuttle
 * @date 2018/4/4
 */
process.env.RUSH_PAPAPA_PORT = 9999
const papapaBabel = require('../')
const babel = require('babel-core')

const { readFile, fixture } = require('./helper')

function transfromFixture(name) {
  return babel.transformFileSync(fixture(name), {
    babelrc: false,
    plugins: [[require.resolve('../'), { moduleName: 'runpappa' }]]
  })
}

describe('papapa Babel', function() {
  it('should React.Component works', function() {
    const { code } = transfromFixture('react-es6/normal-Component.js')
    expect(code).toMatchInlineSnapshot(`
"import * as React from 'react';
import { h } from 'some-where';

const Button = require('runpappa')({
  editor: '',
  port: '9999',
  filename: '/Users/yucong02/self/rush-papapa/babel/__tests__/fixture/react-es6/normal-Component.js',
  line: 4,
  column: 1
})(class Button extends React.Component {
  render() {
    return h.div();
  }
});"
`)
  })
})
