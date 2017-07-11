import { readdirSync, readFileSync, statSync } from 'fs'
import { resolve } from 'path'
import test from 'ava'
import { transform } from 'babel-core'
import plugin from '../dist/index'

const fixturePath = resolve(__dirname, './fixtures')
readdirSync(fixturePath).forEach(fixture => {
  if (fixture.charAt(0) === '.' || !statSync(resolve(fixturePath, fixture)).isDirectory()) {
    return
  }

  let source
  let expected
  let options

  try {
    source = readFileSync(resolve(fixturePath, fixture, 'source.js'), 'utf8')
    expected = readFileSync(resolve(fixturePath, fixture, 'expected.js'), 'utf8')
    options = JSON.parse(readFileSync(resolve(fixturePath, fixture, 'options.json'), 'utf8'))
  } catch (e) {
    console.warn(e)
    return
  }

  test(fixture, t => {
    t.is(transform(source, {
      plugins: [
        [plugin, options]
      ]
    }).code, expected, `Test failed for [${fixture}]`)
  })
})
