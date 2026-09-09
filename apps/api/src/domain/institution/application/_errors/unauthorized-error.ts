export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message ?? 'Usuário não autorizado a realizar esta ação')
    this.name = 'UnauthorizedError'
  }
}
