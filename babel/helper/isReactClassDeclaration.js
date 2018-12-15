/**
 * @file isReactClassDeclaration
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 12/12/2018
 *
 */

function isComponentName(path) {
  return path.type === 'Identifier' && ['Component', 'PureComponent'].includes(path.node.name)
}

function isReactName(path) {
  return path.type === 'Identifier' && ['React'].includes(path.node.name)
}

function isReactComponentSyntax(path) {
  switch (path && path.type) {
    case 'Identifier':
      return isComponentName(path)
    case 'MemberExpression':
      return isReactName(path.get('object')) && isComponentName(path.get('property'))
  }
}

module.exports = function isReactClassDeclaration(path, data) {
  if (path && 'ClassDeclaration' === path.type) {
    return isReactComponentSyntax(path.get('superClass'))
  }

  return false
}
