import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ProjectTag, type ProjectTagProps } from '@/domain/project/enterprise/entities/project-tag'

export function makeProjectTag(override: Partial<ProjectTagProps> = {}, id?: UniqueEntityId) {
  const projectTag = ProjectTag.create(
    {
      projectId: override.projectId ?? new UniqueEntityId(),
      tagId: override.tagId ?? new UniqueEntityId(),
      ...override,
    },
    id,
  )

  return { projectTag }
}
