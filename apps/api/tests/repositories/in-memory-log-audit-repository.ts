import type { LogAuditsRepository } from '@/domain/audit/application/repositories/log-audit-repository'
import type { LogAudit } from '@/domain/audit/enterprise/log-audit'

export class InMemoryLogAuditRepository implements LogAuditsRepository {
  private items: LogAudit[] = []

  async insert(audit: LogAudit): Promise<void> {
    this.items.push(audit)
  }
}
