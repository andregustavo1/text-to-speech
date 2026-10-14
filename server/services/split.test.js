import { test } from 'node:test'
import assert from 'node:assert'
import { splitText } from './split.js'

test('texto curto vira um pedaço só', () => {
  assert.deepStrictEqual(splitText('Olá. Tudo bem?'), ['Olá. Tudo bem?'])
})

test('nenhum pedaço passa do limite e nada se perde', () => {
  const text = 'Uma frase com acentuação é çõ. '.repeat(500) + 'x'.repeat(10000)
  const chunks = splitText(text)
  assert.ok(chunks.length > 1)
  assert.ok(chunks.every((c) => Buffer.byteLength(c) <= 4500))
  assert.strictEqual(chunks.join(''), text)
})

test('texto vazio não gera pedaço', () => {
  assert.deepStrictEqual(splitText('   '), [])
})
