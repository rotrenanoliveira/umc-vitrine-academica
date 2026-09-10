import { InMemoryProjectsRepository } from '@tests/repositories/in-memory-projects-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ProjectStatus } from '../../enterprise/entities/project'
import { RegisterProjectUseCase } from './register-project'

let projectsRepository: InMemoryProjectsRepository
let sut: RegisterProjectUseCase

describe('(UC) - Register Project', () => {
  beforeEach(() => {
    projectsRepository = new InMemoryProjectsRepository()
    sut = new RegisterProjectUseCase(projectsRepository)
  })

  it('should able to register a new project', async () => {
    const authorId = new UniqueEntityId().toString()

    const result = await sut.execute({
      title: 'Vitrine de pesquisa',
      description: 'Projeto acadêmico de divulgação científica',
      authorId,
      attachments: ['attachment-1'],
      tags: ['tag-1'],
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      expect(result.value.project.title).toBe('Vitrine de pesquisa')
      expect(result.value.project.description).toBe('Projeto acadêmico de divulgação científica')
      expect(result.value.project.author.toString()).toBe(authorId)
      expect(result.value.project.status).toBe(ProjectStatus.SKETCH)
      expect(result.value.project.attachments).toEqual(['attachment-1'])
      expect(result.value.project.tags).toEqual(['tag-1'])
      expect(projectsRepository.items).toHaveLength(1)
    }
  })
})
