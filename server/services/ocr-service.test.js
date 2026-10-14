import { describe, it, mock } from 'node:test'
import assert from 'node:assert/strict'
import { createOcrService } from './ocr-service.js'
import { HttpError } from './http-error.js'

// o client do Google é mockado: teste unitário não acessa a rede
const respostaVision = (resultado) => ({ responses: [resultado] })

describe('OcrService', () => {
  it('deveExtrairTextoDaImagemQuandoVisionReconhecerTexto', async () => {
    // Arrange
    const google = mock.fn(async () => respostaVision({ fullTextAnnotation: { text: 'Capítulo 1' } }))
    const ocr = createOcrService({ google, key: 'chave-vision' })

    // Act
    const texto = await ocr.extractText('aW1hZ2Vt')

    // Assert
    assert.equal(texto, 'Capítulo 1')
    assert.equal(google.mock.callCount(), 1)
    const [url, key, body] = google.mock.calls[0].arguments
    assert.match(url, /vision/)
    assert.equal(key, 'chave-vision')
    assert.equal(body.requests[0].image.content, 'aW1hZ2Vt')
    assert.deepEqual(body.requests[0].features, [{ type: 'DOCUMENT_TEXT_DETECTION' }])
  })

  it('deveLancarErro400SemChamarGoogleQuandoImagemAusente', async () => {
    // Arrange
    const google = mock.fn()
    const ocr = createOcrService({ google, key: 'chave-vision' })

    // Act + Assert
    await assert.rejects(ocr.extractText(undefined), (err) => {
      assert.ok(err instanceof HttpError)
      assert.equal(err.status, 400)
      assert.equal(err.message, 'Imagem obrigatória')
      return true
    })
    assert.equal(google.mock.callCount(), 0) // equivalente ao verify(never())
  })

  it('deveLancarErroComMensagemDoVisionQuandoImagemNaoProcessada', async () => {
    // Arrange
    const google = mock.fn(async () => respostaVision({ error: { message: 'Bad image data.' } }))
    const ocr = createOcrService({ google, key: 'chave-vision' })

    // Act + Assert
    await assert.rejects(ocr.extractText('invalida'), { message: 'Bad image data.' })
  })

  it('deveRetornarTextoVazioQuandoImagemNaoTemTexto', async () => {
    // Arrange: página em branco, o Vision não devolve fullTextAnnotation
    const google = mock.fn(async () => respostaVision({}))
    const ocr = createOcrService({ google, key: 'chave-vision' })

    // Act
    const texto = await ocr.extractText('cGFnaW5hRW1CcmFuY28=')

    // Assert
    assert.equal(texto, '')
  })
})
