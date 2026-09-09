export class InvalidInstitutionMemberStatusError extends Error {
  constructor(message?: string) {
    super(message ?? 'Status inválido para encerrar o vínculo')
    this.name = 'InvalidInstitutionMemberStatusError'
  }
}
