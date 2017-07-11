'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (babel) {
  var t = babel.types;


  return {
    name: 'import-peer',
    pre: function pre() {
      this.firstImport = null;
    },

    visitor: {
      ImportDeclaration: function ImportDeclaration(path, _ref) {
        var opts = _ref.opts;

        if (!this.firstImport) {
          this.firstImport = path;
        }

        var node = path.node;
        var src = node.source.value;
        if (src !== opts.package && src.indexOf(opts.package + '/' + opts.path) !== 0) {
          return;
        }

        this.matchPeer = true;

        node.specifiers.map(function (_ref2) {
          var type = _ref2.type,
              imported = _ref2.imported;

          var name = void 0;
          if (imported) {
            name = imported.name === 'default' ? null : imported.name;
          }
          if (type === 'ImportDefaultSpecifier') {
            name = (node.source.value.match(/\/([^/]+)(?:\.\w+)?$/) || [])[1].split('.')[0];
          }
          return getPeerPath(getModuleName(name, opts.transform), opts.fileName);
        }).filter(function (v) {
          return v;
        }).forEach(function (name) {
          path.insertAfter(createImportStatement(t, opts.peerPackage, opts.peerPath, name));
        });
      },

      Program: {
        exit: function exit(path, _ref3) {
          var opts = _ref3.opts;

          if (this.matchPeer && opts.peerGlobal) {
            this.firstImport.insertBefore(createImportStatement(t, opts.peerPackage, '', opts.peerGlobal));
          }
        }
      }
    }
  };
};

var _utils = require('./utils');

function createImportStatement(t, pack, path, name) {
  return t.importDeclaration([], t.stringLiteral((pack + '/' + path + '/' + name).replace(/\/+/g, '/')));
}

function getModuleName(name) {
  var transform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (!name) {
    return null;
  }

  switch (transform) {
    case 'kebab-case':
      return (0, _utils.kebabCase)(name);
    case 'camelCase':
      return (0, _utils.camelCase)(name);
    case 'PascalCase':
      return (0, _utils.pascalCase)(name);
    default:
      return name;
  }
}

function getPeerPath(name, fileName) {
  if (!name) {
    return null;
  }
  return fileName ? fileName.replace(/\$\{module\}/g, name) : name + '.css';
}
module.exports = exports['default'];