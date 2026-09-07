import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'

export interface LogAuditProps {
  madeBy: string
  madeAt: Date
  action: string
  resource: string
  resourceId?: string | null
  payload: Record<string, unknown>
}

export class LogAudit extends Entity<LogAuditProps> {
  get madeBy() {
    return this.props.madeBy
  }

  get madeAt() {
    return this.props.madeAt
  }

  get action() {
    return this.props.action
  }

  get resource() {
    return this.props.resource
  }

  get resourceId() {
    return this.props.resourceId
  }

  get payload() {
    return this.props.payload
  }

  static create(props: Optional<LogAuditProps, 'madeAt'>, id?: UniqueEntityId) {
    return new LogAudit(
      {
        ...props,
        madeAt: props.madeAt ?? new Date(),
        resourceId: props.resourceId ?? null,
      },
      id,
    )
  }
}
