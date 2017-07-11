import { kebabCase, camelCase, pascalCase } from './utils'

export default function (babel) {
  const { types: t } = babel

  return {
    name: 'import-peer',
    pre () {
      this.firstImport = null
    },
    visitor: {
      ImportDeclaration (path, { opts }) {
        if (!this.firstImport) {
          this.firstImport = path
        }

        let node = path.node
        let src = node.source.value
        if (
          src !== opts.package &&
          src.indexOf(`${opts.package}/${opts.path}`) !== 0
        ) {
          return
        }

        this.matchPeer = true

        node.specifiers
          .map(({ type, imported }) => {
            let name
            if (imported) {
              name = imported.name === 'default' ? null : imported.name
            }
            if (type === 'ImportDefaultSpecifier') {
              name = (node.source.value.match(/\/([^/]+)(?:\.\w+)?$/) || [])[1].split('.')[0]
            }
            return getPeerPath(getModuleName(name, opts.transform), opts.fileName)
          })
          .filter(v => v)
          .forEach(name => {
            path.insertAfter(
              createImportStatement(t, opts.peerPackage, opts.peerPath, name)
            )
          })
      },
      Program: {
        exit (path, { opts }) {
          if (this.matchPeer && opts.peerGlobal) {
            this.firstImport.insertBefore(
              createImportStatement(t, opts.peerPackage, '', opts.peerGlobal)
            )
          }
        }
      }
    }
  }
}

function createImportStatement(t, pack, path, name) {
  return t.importDeclaration(
    [],
    t.stringLiteral(`${pack}/${path}/${name}`.replace(/\/+/g, '/'))
  )
}

function getModuleName (name, transform = false) {
  if (!name) {
    return null
  }

  switch (transform) {
    case 'kebab-case':
      return kebabCase(name)
    case 'camelCase':
      return camelCase(name)
    case 'PascalCase':
      return pascalCase(name)
    default:
      return name
  }
}

function getPeerPath (name, fileName) {
  if (!name) {
    return null
  }
  return fileName ? fileName.replace(/\$\{module\}/g, name) : `${name}.css`
}
