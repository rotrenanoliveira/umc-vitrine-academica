export class UserAlreadyMemberOfInstitutionError extends Error {
  constructor(message?: string) {
    super(message ?? 'Usuário já é membro da instituição')
    this.name = 'UserAlreadyMemberOfInstitutionError'
  }
}
