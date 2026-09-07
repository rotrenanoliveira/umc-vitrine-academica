export class InvalidLogAuditError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidLogAuditError'
  }
}
