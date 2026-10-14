import { HttpError } from './http-error.js'

// valida o token "Bearer" do Supabase; só usuário logado pode gastar a cota do Google
export function createAuthService({ supabase }) {
  return {
    async getUser(authorization) {
      const token = authorization?.replace('Bearer ', '')
      if (!token) throw new HttpError(401, 'Não autenticado')

      const { data } = await supabase.auth.getUser(token)
      if (!data?.user) throw new HttpError(401, 'Não autenticado')
      return data.user
    },
  }
}
