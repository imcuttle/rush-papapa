/**
 * @file index
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 13/12/2018
 *
 */
const childProcess = require('child_process')
const envEditor = require('./env-editor')
const lineColumnPath = require('line-column-path')
const opn = require('opn')

const make = (files, opts) => {
  if (!Array.isArray(files)) {
    throw new TypeError(`Expected an \`Array\`, got ${typeof files}`)
  }

  opts = Object.assign({}, opts)

  const editor = opts.editor ? envEditor.get(opts.editor) : envEditor.default()
  const args = []

  if (editor.id === 'vscode') {
    args.push('--goto')
  }

  for (const file of files) {
    const parsed = lineColumnPath.parse(file)

    if (['sublime', 'atom', 'vscode'].indexOf(editor.id) !== -1) {
      args.push(lineColumnPath.stringify(parsed))
      continue
    }

    if (['webstorm', 'intellij'].indexOf(editor.id) !== -1) {
      args.push(lineColumnPath.stringify(parsed, { column: false }))
      continue
    }

    if (editor.id === 'textmate') {
      args.push(
        '--line',
        lineColumnPath.stringify(parsed, {
          file: false
        }),
        parsed.file
      )
      continue
    }

    if (['vim', 'neovim'].indexOf(editor.id) !== -1) {
      args.push(`+call cursor(${parsed.line}, ${parsed.column})`, parsed.file)
      continue
    }

    args.push(parsed.file)
  }

  return {
    bin: editor.bin,
    args,
    isTerminalEditor: editor.isTerminalEditor
  }
}

function spawnP(bin, args, options) {
  return new Promise((resolve, reject) => {
    const cp = childProcess.spawn(bin, args, options)
    cp.on('error', reject)
    cp.on('exit', code => {
      if (code !== 0) {
        reject(new Error(`exit code = ${code}`))
      } else {
        resolve()
      }
    })
  })
}

module.exports = async (files, opts) => {
  const result = make(files, opts)

  const stdio = result.isTerminalEditor ? 'inherit' : 'ignore'

  const binaries = (Array.isArray(result.bin) ? result.bin : [result.bin]).filter(Boolean)

  for (let i = 0; i < binaries.length; i++) {
    const bin = binaries[i]
    try {
      await spawnP(bin, result.args, {
        detached: false,
        stdio
      })
      return
    } catch (e) {}
  }

  // Fallback
  const fbResult = make(files, Object.assign({}, opts, { editor: '' }))

  for (const file of fbResult.args) {
    opn(file, { wait: true }).catch(err => {
      const stripPosFileName = lineColumnPath.parse(file).file
      opn(stripPosFileName, { wait: false })
    })
  }
}

module.exports.make = make

module.exports(['/Users/yucong02/baidu/erp/fe-okr/src/@befe/utils/dev-pattern-vm/Base/BaseAppView.js:8:15'], {
  // editor: 'code'
})
