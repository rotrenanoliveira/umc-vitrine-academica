export class InvalidInstitutionMemberTypeError extends Error {
  constructor(message?: string) {
    super(message ?? 'Apenas alunos e professores podem solicitar vínculo')
    this.name = 'InvalidInstitutionMemberTypeError'
  }
}
