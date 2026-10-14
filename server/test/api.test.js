import { describe, it, beforeEach, mock } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import { createApp } from '../app.js'
import { createGoogleClient } from '../services/google-client.js'
import { createAuthService } from '../services/auth-service.js'
import { createOcrService } from '../services/ocr-service.js'
import { createTtsService } from '../services/tts-service.js'

// integração: rotas + middleware + services + google-client reais.
// só as fronteiras externas são falsas: o fetch (Google) e o Supabase Auth.
let app, googleFetch

function fetchDoGoogle(url) {
  const json = url.includes('vision')
    ? { responses: [{ fullTextAnnotation: { text: 'Texto lido da página.' } }] }
    : { audioContent: Buffer.from('MP3').toString('base64') }
  return { ok: true, json: async () => json }
}

beforeEach(() => {
  // cada teste monta o próprio cenário
  googleFetch = mock.fn(async (url) => fetchDoGoogle(url))
  const google = createGoogleClient(googleFetch)
  const supabase = {
    auth: { getUser: async (token) => ({ data: { user: token === 'token-valido' ? { id: 'uid-1' } : null } }) },
  }
  app = createApp({
    auth: createAuthService({ supabase }),
    ocr: createOcrService({ google, key: 'chave-vision' }),
    tts: createTtsService({ google, key: 'chave-tts' }),
  })
})

describe('API /api/ocr e /api/tts', () => {
  it('deveRetornar200ComTextoQuandoOcrDeImagemValida', async () => {
    const res = await request(app)
      .post('/api/ocr')
      .set('Authorization', 'Bearer token-valido')
      .send({ image: 'aW1hZ2Vt' })

    assert.equal(res.status, 200)
    assert.deepEqual(res.body, { text: 'Texto lido da página.' })
  })

  it('deveRetornar400ComMensagemQuandoTtsSemTexto', async () => {
    const res = await request(app)
      .post('/api/tts')
      .set('Authorization', 'Bearer token-valido')
      .send({ text: '   ' })

    assert.equal(res.status, 400)
    assert.match(res.headers['content-type'], /application\/json/)
    assert.deepEqual(res.body, { error: 'Texto obrigatório' })
    assert.equal(googleFetch.mock.callCount(), 0)
  })

  it('deveRetornar401SemChamarGoogleQuandoUsuarioNaoAutenticado', async () => {
    const res = await request(app).post('/api/tts').send({ text: 'Olá.' })

    assert.equal(res.status, 401)
    assert.deepEqual(res.body, { error: 'Não autenticado' })
    assert.equal(googleFetch.mock.callCount(), 0)
  })

  it('deveRetornar500ComMensagemQuandoGoogleRecusaAChave', async () => {
    googleFetch.mock.mockImplementation(async () => ({
      ok: false,
      json: async () => ({ error: { message: 'API key not valid.' } }),
    }))

    const res = await request(app)
      .post('/api/tts')
      .set('Authorization', 'Bearer token-valido')
      .send({ text: 'Olá.' })

    assert.equal(res.status, 500)
    assert.deepEqual(res.body, { error: 'API key not valid.' })
  })

  it('deveLerPaginaEscaneadaFazendoOcrEDepoisGerandoAudio', async () => {
    // fluxo do botão play com PDF escaneado: imagem -> OCR -> texto -> TTS -> mp3
    const ocr = await request(app)
      .post('/api/ocr')
      .set('Authorization', 'Bearer token-valido')
      .send({ image: 'cGFnaW5h' })

    const tts = await request(app)
      .post('/api/tts')
      .set('Authorization', 'Bearer token-valido')
      .send({ text: ocr.body.text })

    assert.equal(ocr.status, 200)
    assert.equal(tts.status, 200)
    assert.match(tts.headers['content-type'], /audio\/mpeg/)
    assert.equal(tts.body.toString(), 'MP3')
    const [, ttsCall] = googleFetch.mock.calls
    assert.equal(JSON.parse(ttsCall.arguments[1].body).input.text, 'Texto lido da página.')
  })
})
