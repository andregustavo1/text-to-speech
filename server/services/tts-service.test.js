import { describe, it, mock } from 'node:test'
import assert from 'node:assert/strict'
import { createTtsService, MAX_TEXT_LENGTH } from './tts-service.js'
import { HttpError } from './http-error.js'

// o client do Google é mockado: teste unitário não acessa a rede
const audioDe = (conteudo) => ({ audioContent: Buffer.from(conteudo).toString('base64') })

describe('TtsService', () => {
  it('deveSintetizarAudioMp3QuandoTextoValido', async () => {
    // Arrange
    const google = mock.fn(async () => audioDe('mp3'))
    const tts = createTtsService({ google, key: 'chave-tts' })

    // Act
    const audio = await tts.synthesize('Olá, mundo.')

    // Assert
    assert.equal(audio.toString(), 'mp3')
    assert.equal(google.mock.callCount(), 1)
    const [url, key, body] = google.mock.calls[0].arguments
    assert.match(url, /texttospeech/)
    assert.equal(key, 'chave-tts')
    assert.deepEqual(body.voice, { languageCode: 'pt-BR', name: 'pt-BR-Neural2-A' })
    assert.equal(body.input.text, 'Olá, mundo.')
  })

  it('deveLancarErro400SemChamarGoogleQuandoTextoVazio', async () => {
    // Arrange
    const google = mock.fn()
    const tts = createTtsService({ google, key: 'chave-tts' })

    // Act + Assert
    await assert.rejects(tts.synthesize(''), (err) => {
      assert.ok(err instanceof HttpError)
      assert.equal(err.status, 400)
      assert.equal(err.message, 'Texto obrigatório')
      return true
    })
    assert.equal(google.mock.callCount(), 0) // equivalente ao verify(never())
  })

  it('deveLancarErro400QuandoTextoPassaDoLimiteDeCaracteres', async () => {
    // Arrange
    const google = mock.fn()
    const tts = createTtsService({ google, key: 'chave-tts' })

    // Act + Assert
    await assert.rejects(tts.synthesize('a'.repeat(MAX_TEXT_LENGTH + 1)), (err) => {
      assert.ok(err instanceof HttpError)
      assert.equal(err.status, 400)
      assert.equal(err.message, 'Texto muito grande')
      return true
    })
    assert.equal(google.mock.callCount(), 0)
  })

  it('deveAceitarTextoComExatamenteOLimiteDeCaracteres', async () => {
    // Arrange
    const google = mock.fn(async () => audioDe('x'))
    const tts = createTtsService({ google, key: 'chave-tts' })

    // Act
    const audio = await tts.synthesize('a'.repeat(MAX_TEXT_LENGTH))

    // Assert
    assert.ok(audio.length > 0)
    assert.ok(google.mock.callCount() >= 1)
  })

  it('deveChamarGoogleUmaVezPorPedacoEConcatenarAudiosEmOrdem', async () => {
    // Arrange: ~9000 bytes, acima do limite de 4500 por pedido
    let n = 0
    const google = mock.fn(async () => audioDe(`[${n++}]`))
    const tts = createTtsService({ google, key: 'chave-tts' })
    const texto = 'Uma frase de teste. '.repeat(450)

    // Act
    const audio = await tts.synthesize(texto)

    // Assert
    assert.equal(google.mock.callCount(), 2)
    assert.equal(audio.toString(), '[0][1]')
  })

  // parametrizado: entradas inválidas na fronteira da validação
  for (const entrada of ['', '   ', '\n\t', null, undefined, 123]) {
    it(`deveRejeitarTextoInvalido: ${JSON.stringify(entrada)}`, async () => {
      const tts = createTtsService({ google: mock.fn(), key: 'chave-tts' })

      await assert.rejects(tts.synthesize(entrada), { status: 400, message: 'Texto obrigatório' })
    })
  }
})
