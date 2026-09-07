export class TagAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TagAlreadyExistsError'
  }
}
