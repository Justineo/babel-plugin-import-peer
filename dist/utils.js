'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kebabCase = kebabCase;
exports.camelCase = camelCase;
exports.pascalCase = pascalCase;
function kebabCase(str) {
  return str.replace(/[-_ ]+|([A-Z])/g, function (whole, ch) {
    return ch ? '-' + ch.toLowerCase() : '-';
  }).replace(/^-/g, '').replace(/-+/g, '-');
}

function camelCase(str) {
  return kebabCase(str).replace(/-([a-z])/g, function (whole, ch) {
    return ch.toUpperCase();
  });
}

function pascalCase(str) {
  return camelCase(str).replace(/^([a-z])/g, function (whole, ch) {
    return ch.toUpperCase();
  });
}