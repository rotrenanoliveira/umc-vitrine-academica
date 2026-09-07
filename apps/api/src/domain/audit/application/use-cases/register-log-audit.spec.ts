import { InMemoryLogAuditRepository } from '@tests/repositories/in-memory-log-audit-repository'
import { InvalidLogAuditError } from '../_errors/invalid-log-audit-error'
import { RegisterLogAuditUseCase } from './register-log-audit'

let auditsRepository: InMemoryLogAuditRepository
let sut: RegisterLogAuditUseCase

describe('(UC) - Register Log Audit', () => {
  beforeEach(() => {
    auditsRepository = new InMemoryLogAuditRepository()
    sut = new RegisterLogAuditUseCase(auditsRepository)
  })

  it('should be able to register a log audit', async () => {
    const auditRequest = {
      madeBy: 'john.doe',
      action: 'create',
      resource: 'user',
      resourceId: '1',
      payload: { name: 'John Doe' },
    }

    const result = await sut.execute(auditRequest)

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      expect(result.value.audit.madeBy).toBe(auditRequest.madeBy)
      expect(result.value.audit.madeAt).toBeInstanceOf(Date)
      expect(result.value.audit.action).toBe(auditRequest.action)
      expect(result.value.audit.resource).toBe(auditRequest.resource)
      expect(result.value.audit.resourceId).toBe(auditRequest.resourceId)
      expect(result.value.audit.payload).toEqual(auditRequest.payload)
    }
  })

  it('should not be able to register a log audit without action', async () => {
    const result = await sut.execute({
      madeBy: 'john.doe',
      action: '',
      resource: 'user',
      resourceId: '1',
      payload: { name: 'John Doe' },
    })

    expect(result.isLeft()).toBeTruthy()

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidLogAuditError)
      expect(result.value.message).toBe('Parâmetro Inválido: ação não pode ser vazia')
    }
  })

  it('should not be able to register a log audit without resource', async () => {
    const result = await sut.execute({
      madeBy: 'john.doe',
      action: 'create',
      resource: '',
      resourceId: '1',
      payload: { name: 'John Doe' },
    })

    expect(result.isLeft()).toBeTruthy()

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidLogAuditError)
      expect(result.value.message).toBe('Parâmetro Inválido: recurso não pode ser vazio')
    }
  })
})
