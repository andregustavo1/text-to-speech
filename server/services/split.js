// O Google TTS aceita no máximo 5000 bytes por requisição, então quebramos o texto
// em pedaços de até `max` bytes, preferindo cortar no fim das frases.
export function splitText(text, max = 4500) {
  const parts = (text.match(/[^.!?]+[.!?]*\s*/g) ?? [])
    // frase gigante sem pontuação: corta em pedaços de max/4 caracteres (UTF-8 tem até 4 bytes por caractere)
    .flatMap((s) => s.match(new RegExp(`[\\s\\S]{1,${max / 4}}`, 'g')))

  const chunks = []
  let cur = ''
  for (const p of parts) {
    if (Buffer.byteLength(cur + p) > max) {
      chunks.push(cur)
      cur = ''
    }
    cur += p
  }
  if (cur.trim()) chunks.push(cur)
  return chunks
}
