import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { PreferenceTag, type PreferenceTagProps } from '@/domain/tag/enterprise/entities/preference-tag'

export function makePreferenceTag(override: Partial<PreferenceTagProps> = {}, id?: UniqueEntityId) {
  const preferenceTag = PreferenceTag.create(
    {
      userId: new UniqueEntityId(),
      tagId: new UniqueEntityId(),
      ...override,
    },
    id,
  )

  return { preferenceTag }
}
