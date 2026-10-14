import { describe, it, mock } from 'node:test'
import assert from 'node:assert/strict'
import { createAuthService } from './auth-service.js'
import { HttpError } from './http-error.js'

// o Supabase é mockado: teste unitário não acessa a rede
const supabaseCom = (user) => ({ auth: { getUser: mock.fn(async () => ({ data: { user } })) } })

describe('AuthService', () => {
  it('deveRetornarUsuarioQuandoTokenValido', async () => {
    // Arrange
    const supabase = supabaseCom({ id: 'uid-1' })
    const auth = createAuthService({ supabase })

    // Act
    const user = await auth.getUser('Bearer token-valido')

    // Assert
    assert.deepEqual(user, { id: 'uid-1' })
    assert.equal(supabase.auth.getUser.mock.callCount(), 1)
    assert.deepEqual(supabase.auth.getUser.mock.calls[0].arguments, ['token-valido'])
  })

  it('deveLancarErro401QuandoSupabaseNaoReconheceOToken', async () => {
    // Arrange
    const auth = createAuthService({ supabase: supabaseCom(null) })

    // Act + Assert
    await assert.rejects(auth.getUser('Bearer token-expirado'), (err) => {
      assert.ok(err instanceof HttpError)
      assert.equal(err.status, 401)
      assert.equal(err.message, 'Não autenticado')
      return true
    })
  })

  // parametrizado: cabeçalhos sem token não devem nem consultar o Supabase
  for (const header of [undefined, '', 'Bearer ']) {
    it(`deveLancarErro401SemConsultarSupabaseQuandoSemToken: ${JSON.stringify(header)}`, async () => {
      const supabase = supabaseCom({ id: 'uid-1' })
      const auth = createAuthService({ supabase })

      await assert.rejects(auth.getUser(header), { status: 401, message: 'Não autenticado' })
      assert.equal(supabase.auth.getUser.mock.callCount(), 0) // equivalente ao verify(never())
    })
  }
})
