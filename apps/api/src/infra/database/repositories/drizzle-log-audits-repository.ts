import type { LogAuditsRepository } from '@/domain/audit/application/repositories/log-audit-repository'
import type { LogAudit } from '@/domain/audit/enterprise/log-audit'
import type { DrizzleClient } from '../drizzle/client'
import { DrizzleLogAuditMapper } from '../drizzle/mappers/drizzle-log-audit-mapper'
import { logsAudit } from '../drizzle/schemas'

export class DrizzleLogAuditsRepository implements LogAuditsRepository {
  constructor(readonly db: DrizzleClient) {}

  async insert(audit: LogAudit): Promise<void> {
    await this.db.insert(logsAudit).values(DrizzleLogAuditMapper.toPersistence(audit))
  }
}
