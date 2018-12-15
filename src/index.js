/**
 * The amusing locate the position of code from UI
 * @author imcuttle
 */
const toCompClass = require('@rcp/util.tocompclass').default
const displayName = require('@rcp/util.displayname').default
const React = require('react')
const ReactDOM = require('react-dom')
const { parse } = require('url')
const { stringify } = require('line-column-path')

const backgroundImage =
  'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTQ0NjEwMjM4MjY2IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIwODQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNTEzLjMgMTI5LjRtLTc0LjkgMGE3NC45IDc0LjkgMCAxIDAgMTQ5LjggMCA3NC45IDc0LjkgMCAxIDAtMTQ5LjggMFoiIGZpbGw9IiNDQzNFM0UiIHAtaWQ9IjIwODUiPjwvcGF0aD48cGF0aCBkPSJNNTEzLjMgMjA4LjhjLTQzLjcgMC03OS4zLTM1LjYtNzkuMy03OS40IDAtNDMuNyAzNS42LTc5LjMgNzkuMy03OS4zczc5LjMgMzUuNiA3OS4zIDc5LjNjMCA0My44LTM1LjUgNzkuNC03OS4zIDc5LjR6IG0wLTE0OS43Yy0zOC44IDAtNzAuNCAzMS42LTcwLjQgNzAuMyAwIDM4LjggMzEuNiA3MC40IDcwLjQgNzAuNHM3MC40LTMxLjYgNzAuNC03MC40YzAtMzguOC0zMS42LTcwLjMtNzAuNC03MC4zeiIgZmlsbD0iI0JBM0UzRSIgcC1pZD0iMjA4NiI+PC9wYXRoPjxwYXRoIGQ9Ik05MzMuOCA3MzdWNjExYzAtMjMxLjItMTg5LjItNDIwLjQtNDIwLjQtNDIwLjRTOTMgMzc5LjggOTMgNjExdjEyNmg4NDAuOHoiIGZpbGw9IiNERDU1M0EiIHAtaWQ9IjIwODciPjwvcGF0aD48cGF0aCBkPSJNOTMzLjggNzQ1LjlIOTIuOWMtNSAwLTktNC05LTl2LTEyNmMwLTIzNi44IDE5Mi42LTQyOS40IDQyOS40LTQyOS40czQyOS40IDE5Mi42IDQyOS40IDQyOS40djEyNmMwIDUtNCA5LTguOSA5eiBtLTgzMi0xNy45aDgyMi45VjYxMC45YzAtMjI2LjktMTg0LjYtNDExLjUtNDExLjUtNDExLjVTMTAxLjcgMzg0IDEwMS43IDYxMC45VjcyOHoiIGZpbGw9IiNEMzJEMkQiIHAtaWQ9IjIwODgiPjwvcGF0aD48cGF0aCBkPSJNMjY2LjggNDQyYy0wLjYgMC0xLjItMC4xLTEuOC0wLjItNC45LTEtOC01LjgtNy0xMC42IDIuNC0xMS41IDUuMy0yMyA4LjctMzQuMSAxLjQtNC43IDYuNS03LjUgMTEuMi02IDQuOCAxLjQgNy40IDYuNSA2IDExLjItMy4yIDEwLjYtNiAyMS41LTguMyAzMi41LTAuOSA0LjMtNC43IDcuMi04LjggNy4yek0yNjEuNiA0NzIuN2MtNSAwLTEwLjEtNC0xMC4xLTkgMC00LjkgMi45LTkgNy45LTloMi4yYzUgMCA5IDQgOSA5IDAgNC45LTQuMSA5LTkgOXpNNzU2LjQgNDIzLjFjLTMuOSAwLTcuNC0yLjUtOC42LTYuNC0xLjQtNC43LTMtOS4yLTQuNy0xMy43LTEuOC00LjYgMC40LTkuOCA1LTExLjYgNC42LTEuOCA5LjggMC40IDExLjYgNSAxLjkgNC45IDMuNyA5LjkgNS4yIDE1LjEgMS40IDQuNy0xLjIgOS43LTYgMTEuMi0wLjggMC4zLTEuNyAwLjQtMi41IDAuNHoiIGZpbGw9IiNEMzJEMkQiIHAtaWQ9IjIwODkiPjwvcGF0aD48cGF0aCBkPSJNMjc1LjIgNDA4LjdjLTAuOSAwLTEuNy0wLjEtMi42LTAuNC00LjctMS40LTcuNC02LjUtNi0xMS4yIDM4LjktMTI5IDEzOC0yMTUuNyAyNDYuNy0yMTUuNyAxMDAuOSAwIDE5MS41IDcxLjQgMjM2LjUgMTg2LjMgMS44IDQuNi0wLjUgOS44LTUuMSAxMS42LTQuNiAxLjgtOS44LTAuNS0xMS42LTUuMS00Mi4zLTEwNy44LTEyNi41LTE3NC44LTIxOS44LTE3NC44LTEwMC43IDAtMTkyLjkgODEuNS0yMjkuNSAyMDIuOS0xLjIgMy45LTQuNyA2LjQtOC42IDYuNHpNMzc3LjIgNDM5LjVjLTQuNiAwLTguNS0zLjUtOC45LTguMi0wLjUtNS4yLTAuNS0xMC41LTAuMi0xNS44IDAuMy00LjkgNC42LTguMyA5LjUtOC40IDUgMC4zIDguNyA0LjYgOC40IDkuNS0wLjMgNC40LTAuMiA4LjcgMC4yIDEzLjEgMC40IDQuOS0zLjIgOS4zLTguMiA5LjctMC4zIDAuMS0wLjYgMC4xLTAuOCAwLjF6IiBmaWxsPSIjRDMyRDJEIiBwLWlkPSIyMDkwIj48L3BhdGg+PHBhdGggZD0iTTY0MCAzODYuOWMtNSAwLTktNC05LTkgMC05OC40LTU1LjctMTc4LjQtMTI0LjItMTc4LjRzLTEyNC4yIDgwLTEyNC4yIDE3OC40YzAgNC45LTQgOS05IDlzLTktNC05LTljMC0xMDguMyA2My44LTE5Ni40IDE0Mi4xLTE5Ni40UzY0OSAyNjkuNiA2NDkgMzc3LjljMCA0LjktNCA5LTkgOXoiIGZpbGw9IiNEMzJEMkQiIHAtaWQ9IjIwOTEiPjwvcGF0aD48cGF0aCBkPSJNOTU3LjMgODk3LjVINjkuNGMtMjQuOSAwLTQ1LjMtMjAuNC00NS4zLTQ1LjN2LTE1M2MwLTI0LjkgMjAuNC00NS4zIDQ1LjMtNDUuM2g4ODcuOWMyNC45IDAgNDUuMyAyMC40IDQ1LjMgNDUuM3YxNTIuOWMwIDI1LTIwLjQgNDUuNC00NS4zIDQ1LjR6IiBmaWxsPSIjRURGNEYzIiBwLWlkPSIyMDkyIj48L3BhdGg+PHBhdGggZD0iTTk1My40IDkwNi40SDczLjJjLTMyLjEgMC01OC4yLTI2LjEtNTguMi01OC4xVjcwMy4xYzAtMzIuMSAyNi4xLTU4LjIgNTguMi01OC4yaDg4MC4yYzMyLjEgMCA1OC4yIDI2LjEgNTguMiA1OC4ydjE0NS4yYzAgMzItMjYuMSA1OC4xLTU4LjIgNTguMXpNNzMuMiA2NjIuOUM1MSA2NjIuOSAzMyA2ODEgMzMgNzAzLjF2MTQ1LjJjMCAyMi4yIDE4IDQwLjIgNDAuMiA0MC4yaDg4MC4yYzIyLjIgMCA0MC4yLTE4IDQwLjItNDAuMlY3MDMuMWMwLTIyLjItMTgtNDAuMi00MC4yLTQwLjJINzMuMnoiIGZpbGw9IiNGN0Y5RjkiIHAtaWQ9IjIwOTMiPjwvcGF0aD48cGF0aCBkPSJNMzggODY3LjVjNy40IDE3LjUgMjQuNSAyOS45IDQ0LjMgMjkuOWg4NjJjMTkuOCAwIDM2LjktMTIuNCA0NC4zLTI5LjlIMzh6TTkyLjkgODQyLjFjLTcuNCAwLTEzLjUtNi0xMy41LTEzLjVWNzExLjljMC03LjQgNi0xMy41IDEzLjUtMTMuNXMxMy41IDYgMTMuNSAxMy41djExNi43Yy0wLjEgNy41LTYuMSAxMy41LTEzLjUgMTMuNXpNMTg0LjEgODUxLjhjLTcuNCAwLTEzLjUtNi0xMy41LTEzLjVWNzAyLjJjMC03LjQgNi0xMy41IDEzLjUtMTMuNXMxMy41IDYgMTMuNSAxMy41djEzNi4yYy0wLjEgNy40LTYuMSAxMy40LTEzLjUgMTMuNHoiIGZpbGw9IiNCQ0M5QzciIHAtaWQ9IjIwOTQiPjwvcGF0aD48cGF0aCBkPSJNMjc1LjIgODQyLjFjLTcuNCAwLTEzLjUtNi0xMy41LTEzLjVWNzExLjljMC03LjQgNi0xMy41IDEzLjUtMTMuNSA3LjQgMCAxMy41IDYgMTMuNSAxMy41djExNi43YzAgNy41LTYgMTMuNS0xMy41IDEzLjV6IiBmaWxsPSIjQkNDOUM3IiBwLWlkPSIyMDk1Ij48L3BhdGg+PHBhdGggZD0iTTM2Ni40IDg3MC45Yy03LjQgMC0xMy41LTYtMTMuNS0xMy41VjY5MWMwLTcuNCA2LTEzLjUgMTMuNS0xMy41czEzLjUgNiAxMy41IDEzLjV2MTY2LjRjMCA3LjQtNiAxMy41LTEzLjUgMTMuNXoiIGZpbGw9IiNCQ0M5QzciIHAtaWQ9IjIwOTYiPjwvcGF0aD48cGF0aCBkPSJNNDU3LjYgODQyLjFjLTcuNCAwLTEzLjUtNi0xMy41LTEzLjVWNzExLjljMC03LjQgNi0xMy41IDEzLjUtMTMuNSA3LjQgMCAxMy41IDYgMTMuNSAxMy41djExNi43YzAgNy41LTYuMSAxMy41LTEzLjUgMTMuNXoiIGZpbGw9IiNCQ0M5QzciIHAtaWQ9IjIwOTciPjwvcGF0aD48cGF0aCBkPSJNNTQ4LjggODg0Yy03LjQgMC0xMy41LTYtMTMuNS0xMy41VjY4MC44YzAtNy40IDYtMTMuNSAxMy41LTEzLjUgNy40IDAgMTMuNSA2IDEzLjUgMTMuNXYxODkuN2MwIDcuNS02LjEgMTMuNS0xMy41IDEzLjV6IiBmaWxsPSIjQkNDOUM3IiBwLWlkPSIyMDk4Ij48L3BhdGg+PHBhdGggZD0iTTY0MCA4NDcuNWMtNy40IDAtMTMuNS02LTEzLjUtMTMuNVY3MTcuM2MwLTcuNCA2LTEzLjUgMTMuNS0xMy41czEzLjUgNiAxMy41IDEzLjVWODM0YzAgNy41LTYuMSAxMy41LTEzLjUgMTMuNXoiIGZpbGw9IiNCQ0M5QzciIHAtaWQ9IjIwOTkiPjwvcGF0aD48cGF0aCBkPSJNNzMxLjIgODQyLjFjLTcuNCAwLTEzLjUtNi0xMy41LTEzLjVWNzExLjljMC03LjQgNi0xMy41IDEzLjUtMTMuNSA3LjQgMCAxMy41IDYgMTMuNSAxMy41djExNi43YzAgNy41LTYuMSAxMy41LTEzLjUgMTMuNXoiIGZpbGw9IiNCQ0M5QzciIHAtaWQ9IjIxMDAiPjwvcGF0aD48cGF0aCBkPSJNODIyLjQgODQyLjFjLTcuNCAwLTEzLjUtNi0xMy41LTEzLjVWNjgwLjhjMC03LjQgNi0xMy41IDEzLjUtMTMuNSA3LjQgMCAxMy41IDYgMTMuNSAxMy41djE0Ny44Yy0wLjEgNy41LTYuMSAxMy41LTEzLjUgMTMuNXoiIGZpbGw9IiNCQ0M5QzciIHAtaWQ9IjIxMDEiPjwvcGF0aD48cGF0aCBkPSJNOTEzLjYgODQyLjFjLTcuNCAwLTEzLjUtNi0xMy41LTEzLjVWNzExLjljMC03LjQgNi0xMy41IDEzLjUtMTMuNXMxMy41IDYgMTMuNSAxMy41djExNi43Yy0wLjEgNy41LTYuMSAxMy41LTEzLjUgMTMuNXoiIGZpbGw9IiNCQ0M5QzciIHAtaWQ9IjIxMDIiPjwvcGF0aD48L3N2Zz4=)'

let open
let exactEditor
let debug
if (typeof location !== 'undefined') {
  const { query } = parse(location.href, true)
  open = location.search.indexOf('rush-papapa=true') >= 0 || !!localStorage.getItem('rush-papapa')
  debug = location.search.indexOf('rush-papapa-debug=true') >= 0 || !!localStorage.getItem('rush-papapa-debug')
  exactEditor = query['rush-papapa-editor'] || localStorage.getItem('rush-papapa-editor')
}

function getOffset(el) {
  el = el.getBoundingClientRect()
  return {
    left: el.left + global.scrollX,
    top: el.top + global.scrollY
  }
}
const makeRender = () => {
  let dom
  let currentOpts
  return function render(target, opts = {}) {
    const width = 20
    const height = 20
    currentOpts = opts
    if (!dom) {
      dom = document.createElement('div')
      document.body.appendChild(dom)
      Object.assign(dom.style, {
        width: width + 'px',
        height: height + 'px',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        position: 'absolute',
        cursor: 'pointer',
        backgroundImage
      })

      dom.addEventListener('click', () => {
        const file = currentOpts.file
        const port = currentOpts.port
        const editor = currentOpts.editor

        if (file) {
          const xhr = new XMLHttpRequest()
          xhr.open(
            'GET',
            `http://localhost:${port}/?editor=${encodeURIComponent(
              exactEditor || editor || ''
            )}&pos=${encodeURIComponent(file)}`
          )
          xhr.send()
          xhr.onload = function(e) {
            if (this.status === 200 || this.status === 304) {
            }
          }
        }
      })
    }

    const rect = getOffset(target)
    Object.assign(dom.style, {
      top: `${rect.top - height / 2}px`,
      left: `${rect.left - width / 2}px`
    })
  }
}

let render = global.__RUSH_PAPAPA__
if (open && typeof document !== 'undefined') {
  if (!global.__RUSH_PAPAPA__) {
    render = makeRender()
    global.__RUSH_PAPAPA__ = render
  }
}

module.exports = rushPapapa

function rushPapapa({ filename, line, column, port, editor } = {}) {
  return function(Component) {
    if (!open) {
      return Component
    }

    Component = toCompClass(Component)

    return class extends Component {
      static displayName = `Papapa-${displayName(Component)}`

      render() {
        const element = super.render()
        if (!React.isValidElement(element)) {
          return element
        }

        let debugProps = {}
        if (debug) {
          debugProps = {
            'data-rush-papapa': stringify({ file: filename, line, column }),
            'data-rush-papapa-port': port,
            'data-rush-papapa-editor': editor
          }
        }

        const onMouseEnter = element.props.onMouseEnter
        return React.cloneElement(element, {
          ...debugProps,
          style: debug
            ? {
                outline: '1px #ff3d3d dotted',
                outlineOffset: -1,
                ...element.props.style
              }
            : element.props.style,
          onMouseEnter: (...argv) => {
            const domNode = ReactDOM.findDOMNode(this)
            domNode &&
              render(domNode, {
                file: stringify({ file: filename, line, column }),
                port,
                editor
              })

            if (typeof onMouseEnter === 'function') {
              return onMouseEnter.apply(this, argv)
            }
          }
        })
      }
    }
  }
}
