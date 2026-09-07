import { makeTag } from '@tests/factories/make-tag'
import { InMemoryTagsRepository } from '@tests/repositories/in-memory-tags-repository'
import { UpdateTagUseCase } from './update-tag'

let tagsRepository: InMemoryTagsRepository
let sut: UpdateTagUseCase

describe('(UC) - Bind Tag By Id', () => {
  beforeEach(() => {
    tagsRepository = new InMemoryTagsRepository()
    sut = new UpdateTagUseCase(tagsRepository)
  })

  it('should be able to find tag by id', async () => {
    const { tag } = makeTag()
    tagsRepository.items.push(tag)

    const result = await sut.execute({
      id: tag.id.toString(),
      status: 'INACTIVE',
    })

    expect(result.isRight())

    if (result.isRight()) {
      expect(result.value.tag.slug.value).toBe(tag.slug.value)
      expect(result.value.tag.status).toBe('INACTIVE')
      expect(result.value.tag.isActive).toBeFalsy()
    }
  })

  it('should not be able to update tag with invalid id', async () => {
    const result = await sut.execute({
      id: 'invalid-id',
      status: 'INACTIVE',
    })

    expect(result.isLeft())

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(Error)
      expect(result.value.message).toBe('Tag não encontrado')
    }
  })
})
