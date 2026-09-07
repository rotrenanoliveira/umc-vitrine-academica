import { type Either, left, right } from '@/core/either'
import { LogAudit } from '../../enterprise/log-audit'
import { InvalidLogAuditError } from '../_errors/invalid-log-audit-error'
import type { LogAuditsRepository } from '../repositories/log-audit-repository'

interface RegisterLogAuditUseCaseRequest {
  madeBy: string
  action: string
  resource: string
  resourceId?: string
  payload: Record<string, unknown>
}

type RegisterLogAuditUseCaseResponse = Either<InvalidLogAuditError, { audit: LogAudit }>

export class RegisterLogAuditUseCase {
  constructor(private readonly auditsRepository: LogAuditsRepository) {}

  async execute(input: RegisterLogAuditUseCaseRequest): Promise<RegisterLogAuditUseCaseResponse> {
    if (!input.action.trim()) {
      return left(new InvalidLogAuditError(`Parâmetro Inválido: ação não pode ser vazia`))
    }

    if (!input.resource.trim()) {
      return left(new InvalidLogAuditError(`Parâmetro Inválido: recurso não pode ser vazio`))
    }

    const audit = LogAudit.create(input)

    await this.auditsRepository.insert(audit)

    return right({ audit })
  }
}
