// chamada genérica às APIs REST do Google; fetchFn é injetável para os testes
export function createGoogleClient(fetchFn = fetch) {
  return async function post(url, key, body) {
    const res = await fetchFn(`${url}?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error?.message ?? 'Erro na API do Google')
    return json
  }
}
