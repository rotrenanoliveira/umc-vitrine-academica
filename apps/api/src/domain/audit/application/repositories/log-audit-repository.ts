import type { LogAudit } from '../../enterprise/log-audit'

export interface LogAuditsRepository {
  insert(audit: LogAudit): Promise<void>
}
