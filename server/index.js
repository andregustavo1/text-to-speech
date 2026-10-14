import { createClient } from '@supabase/supabase-js'
import { createApp } from './app.js'
import { createGoogleClient } from './services/google-client.js'
import { createAuthService } from './services/auth-service.js'
import { createOcrService } from './services/ocr-service.js'
import { createTtsService } from './services/tts-service.js'

const { GOOGLE_VISION_KEY, GOOGLE_TTS_KEY, SUPABASE_URL, SUPABASE_ANON_KEY, PORT = 3001 } = process.env

const google = createGoogleClient()
const app = createApp({
  auth: createAuthService({ supabase: createClient(SUPABASE_URL, SUPABASE_ANON_KEY) }),
  ocr: createOcrService({ google, key: GOOGLE_VISION_KEY }),
  tts: createTtsService({ google, key: GOOGLE_TTS_KEY }),
})

app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`))
