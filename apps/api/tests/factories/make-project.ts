const { faker } = require('@faker-js/faker/locale/pt_BR')

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Project, type ProjectProps } from '@/domain/project/enterprise/entities/project'

export function makeProject(override: Partial<ProjectProps> = {}, id?: UniqueEntityId) {
  const project = Project.create(
    {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      author: new UniqueEntityId(),
      ...override,
    },
    id,
  )

  return { project }
}
