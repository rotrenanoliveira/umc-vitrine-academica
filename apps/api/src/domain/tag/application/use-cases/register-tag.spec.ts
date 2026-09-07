import { makeTag } from '@tests/factories/make-tag'
import { InMemoryTagsRepository } from '@tests/repositories/in-memory-tags-repository'
import { TagAlreadyExistsError } from '../_errors/tag-already-exists-error'
import { RegisterTagUseCase } from './register-tag'

let tagsRepository: InMemoryTagsRepository
let sut: RegisterTagUseCase

describe('(UC) - Register Tag', () => {
  beforeEach(() => {
    tagsRepository = new InMemoryTagsRepository()
    sut = new RegisterTagUseCase(tagsRepository)
  })

  it('should be able to register a new tag', async () => {
    const result = await sut.execute({
      name: 'projeto de integração',
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      expect(result.value.tag.name).toBe('projeto de integração')
      expect(result.value.tag.slug.value).toBe('projeto-de-integracao')
      expect(result.value.tag.status).toBe('ACTIVE')
      expect(result.value.tag.isActive).toBeTruthy()
    }
  })

  it('should not be able to register a tag with same slug', async () => {
    const { tag } = makeTag({ name: 'projeto de integração' })
    tagsRepository.items.push(tag)

    const result = await sut.execute({
      name: 'projeto de integração',
    })

    expect(result.isLeft())

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(TagAlreadyExistsError)
      expect(result.value.message).toBe(`Tag com a slug "projeto-de-integracao" já existe`)
    }
  })
})
