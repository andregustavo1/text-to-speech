import { describe, it, mock } from 'node:test'
import assert from 'node:assert/strict'
import { createGoogleClient } from './google-client.js'

// o fetch é mockado: teste unitário não acessa a rede
const respostaFetch = (ok, json) => mock.fn(async () => ({ ok, json: async () => json }))

describe('GoogleClient', () => {
  it('deveEnviarPostComChaveNaUrlERetornarJson', async () => {
    // Arrange
    const fetchFn = respostaFetch(true, { audioContent: 'abc' })
    const post = createGoogleClient(fetchFn)

    // Act
    const json = await post('https://api.google/x', 'minha-chave', { a: 1 })

    // Assert
    assert.deepEqual(json, { audioContent: 'abc' })
    const [url, options] = fetchFn.mock.calls[0].arguments
    assert.equal(url, 'https://api.google/x?key=minha-chave')
    assert.equal(options.method, 'POST')
    assert.equal(options.body, '{"a":1}')
  })

  it('deveLancarErroComMensagemDoGoogleQuandoRespostaNaoOk', async () => {
    // Arrange
    const post = createGoogleClient(respostaFetch(false, { error: { message: 'API key not valid.' } }))

    // Act + Assert
    await assert.rejects(post('https://api.google/x', 'chave-errada', {}), { message: 'API key not valid.' })
  })

  it('deveUsarMensagemPadraoQuandoErroDoGoogleVemSemMensagem', async () => {
    // Arrange
    const post = createGoogleClient(respostaFetch(false, {}))

    // Act + Assert
    await assert.rejects(post('https://api.google/x', 'k', {}), { message: 'Erro na API do Google' })
  })
})
