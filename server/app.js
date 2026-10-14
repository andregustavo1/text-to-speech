import express from 'express'

// monta o app sem subir o servidor, para os testes usarem com dependências mockadas
export function createApp({ auth, ocr, tts }) {
  const app = express()
  app.use(express.json({ limit: '15mb' }))

  app.use(async (req, res, next) => {
    req.user = await auth.getUser(req.headers.authorization)
    next()
  })

  app.post('/api/ocr', async (req, res) => {
    res.json({ text: await ocr.extractText(req.body.image) })
  })

  app.post('/api/tts', async (req, res) => {
    const audio = await tts.synthesize(req.body.text)
    res.type('audio/mpeg').send(audio)
  })

  app.use((err, req, res, _next) => {
    if (!err.status) console.error(err)
    res.status(err.status ?? 500).json({ error: err.message })
  })

  return app
}
