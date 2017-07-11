export function kebabCase (str) {
  return str
    .replace(/[-_ ]+|([A-Z])/g, (whole, ch) => {
        return ch ? `-${ch.toLowerCase()}` : '-'
    })
    .replace(/^-/g, '')
    .replace(/-+/g, '-')
}

export function camelCase (str) {
  return kebabCase(str).replace(/-([a-z])/g, (whole, ch) => ch.toUpperCase())
}

export function pascalCase (str) {
  return camelCase(str).replace(/^([a-z])/g, (whole, ch) => ch.toUpperCase())
}
