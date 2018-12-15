/**
 * @file index
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 12/12/2018
 *
 */

const isReactClassDeclaration = require('./helper/isReactClassDeclaration')
const match = require('./helper/match')
const { run, readPort } = require('../server/single')

run(process.env.RUSH_PAPAPA_PORT)

const getOptions = opt => {
  return {
    includes: [() => true],
    excludes: [],
    editor: '',
    moduleName: require.resolve('..'),
    ...opt
  }
}

module.exports = function(babel) {
  const t = babel.types

  return {
    pre(data) {
      this.opts = getOptions(this.opts)
    },
    visitor: {
      ClassDeclaration(path, data) {
        const opts = this.opts
        const { parserOpts } = this.file
        const sourceFileName = parserOpts.sourceFileName
        const isAllow = match(sourceFileName, opts.includes) && !match(sourceFileName, opts.excludes)

        if (!isAllow) {
          return
        }

        if (isReactClassDeclaration(path)) {
          if (path.node.id) {
            const name = path.node.id.name
            path.replaceWith(
              t.VariableDeclaration('const', [
                t.VariableDeclarator(
                  t.Identifier(name),
                  // require('run-papap')(options)(...)
                  t.CallExpression(
                    // require()()
                    t.CallExpression(
                      // require()
                      t.CallExpression(t.Identifier('require'), [t.StringLiteral(opts.moduleName)]),
                      [
                        t.ObjectExpression([
                          t.ObjectProperty(t.Identifier('editor'), t.StringLiteral(opts.editor)),
                          t.ObjectProperty(t.Identifier('port'), t.StringLiteral(readPort())),
                          t.ObjectProperty(t.Identifier('filename'), t.StringLiteral(sourceFileName)),
                          t.ObjectProperty(t.Identifier('line'), t.NumericLiteral(path.node.loc.start.line)),
                          t.ObjectProperty(t.Identifier('column'), t.NumericLiteral(path.node.loc.start.column + 1))
                        ])
                      ]
                    ),
                    [{ ...path.node, type: 'ClassExpression' }]
                  )
                )
              ])
            )
          }
        }
        // const {key} = data;
      }
    }
  }
}
