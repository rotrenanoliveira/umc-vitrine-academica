import { LogAudit } from '@/domain/audit/enterprise/log-audit'
import type { logsAudit } from '../schemas/log-audit'

type DrizzleLogAudit = typeof logsAudit.$inferSelect
type DrizzleLogAuditInsert = typeof logsAudit.$inferInsert

export class DrizzleLogAuditMapper {
  static toDomain(row: DrizzleLogAudit): LogAudit {
    return LogAudit.create({
      madeBy: row.madeBy,
      madeAt: row.madeAt,
      action: row.action,
      resource: row.resource,
      resourceId: row.resourceId,
      payload: JSON.parse(row.payload),
    })
  }

  static toPersistence(audit: LogAudit): DrizzleLogAuditInsert {
    return {
      id: audit.id.toString(),
      madeBy: audit.madeBy,
      madeAt: audit.madeAt,
      action: audit.action,
      resource: audit.resource,
      resourceId: audit.resourceId,
      payload: JSON.stringify(audit.payload),
    }
  }
}
