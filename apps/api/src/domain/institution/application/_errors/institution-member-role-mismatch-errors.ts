export class InstitutionMemberRoleMismatchError extends Error {
  constructor() {
    super('O membro não possui o papel institucional esperado')
  }
}
