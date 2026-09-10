import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  AccessCode,
  type AccessCodeProps,
} from '@/domain/identity/enterprise/entities/access-code'

export function makeAccessCode(override: Partial<AccessCodeProps> = {}, id?: UniqueEntityId) {
  const accessCode = AccessCode.create(
    {
      accountId: new UniqueEntityId(),
      codeHash: '123456-hashed',
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      ...override,
    },
    id,
  )

  return { accessCode }
}
