import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  ProjectScheduled,
  type ProjectScheduledProps,
} from '@/domain/project/enterprise/entities/project-scheduled'

export function makeProjectScheduled(
  override: Partial<ProjectScheduledProps> = {},
  id?: UniqueEntityId,
) {
  const projectScheduled = ProjectScheduled.create(
    {
      projectId: new UniqueEntityId(),
      publishedIn: new Date(),
      ...override,
    },
    id,
  )

  return { projectScheduled }
}
