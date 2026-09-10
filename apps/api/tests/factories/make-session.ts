import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Session, type SessionProps } from '@/domain/identity/enterprise/entities/session'

export function makeSession(override: Partial<SessionProps> = {}, id?: UniqueEntityId) {
  const session = Session.create(
    {
      accountId: new UniqueEntityId(),
      userId: new UniqueEntityId(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ...override,
    },
    id,
  )

  return { session }
}
