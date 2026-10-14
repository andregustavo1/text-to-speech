import { HttpError } from './http-error.js'

const VISION_URL = 'https://vision.googleapis.com/v1/images:annotate'

// recebe a página renderizada como imagem (base64) e devolve o texto
export function createOcrService({ google, key }) {
  return {
    async extractText(image) {
      if (typeof image !== 'string' || !image) throw new HttpError(400, 'Imagem obrigatória')

      const json = await google(VISION_URL, key, {
        requests: [{
          image: { content: image },
          features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
          imageContext: { languageHints: ['pt'] },
        }],
      })
      const [result] = json.responses
      if (result.error) throw new Error(result.error.message)
      return result.fullTextAnnotation?.text ?? ''
    },
  }
}
