import { HttpError } from './http-error.js'
import { splitText } from './split.js'

const TTS_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize'
export const MAX_TEXT_LENGTH = 20000

// recebe o texto e devolve o áudio em mp3 (Buffer)
export function createTtsService({ google, key, voice = 'pt-BR-Neural2-A' }) {
  return {
    async synthesize(text) {
      if (typeof text !== 'string' || !text.trim()) throw new HttpError(400, 'Texto obrigatório')
      if (text.length > MAX_TEXT_LENGTH) throw new HttpError(400, 'Texto muito grande')

      const audios = []
      for (const chunk of splitText(text)) {
        const json = await google(TTS_URL, key, {
          input: { text: chunk },
          voice: { languageCode: 'pt-BR', name: voice },
          audioConfig: { audioEncoding: 'MP3' },
        })
        audios.push(Buffer.from(json.audioContent, 'base64'))
      }
      // frames de MP3 podem ser concatenados direto
      return Buffer.concat(audios)
    },
  }
}
