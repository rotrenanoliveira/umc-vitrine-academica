export class InstitutionAlreadyExistsError extends Error {
  constructor(message?: string) {
    super(message ?? 'Já existe uma instituição com este slug')
    this.name = 'InstitutionAlreadyExistsError'
  }
}
