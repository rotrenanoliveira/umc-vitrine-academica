export class TagNotFoundError extends Error {
  constructor(message?: string) {
    super(message ?? 'Tag não encontrado')
    this.name = 'TagNotFoundError'
  }
}
