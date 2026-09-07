import { makeTag } from '@tests/factories/make-tag'
import { InMemoryTagsRepository } from '@tests/repositories/in-memory-tags-repository'
import { FindTagByIdUseCase } from './find-tag-by-id'

let tagsRepository: InMemoryTagsRepository
let sut: FindTagByIdUseCase

describe('(UC) - Bind Tag By Id', () => {
  beforeEach(() => {
    tagsRepository = new InMemoryTagsRepository()
    sut = new FindTagByIdUseCase(tagsRepository)
  })

  it('should be able to find tag by id', async () => {
    for (let i = 0; i < 5; i++) {
      const { tag } = makeTag({ name: `tag-${i}` })
      tagsRepository.items.push(tag)
    }

    const { tag } = makeTag()

    const result = await sut.execute({
      id: tag.id.toString(),
    })

    expect(result.isRight())

    if (result.isRight()) {
      expect(result.value.tag.name).toBe(tag.name)
      expect(result.value.tag.slug.value).toBe(tag.slug.value)
    }
  })

  it('should not be able to find tag with invalid id', async () => {
    const result = await sut.execute({
      id: 'invalid-id',
    })

    expect(result.isLeft())

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(Error)
      expect(result.value.message).toBe('Tag com id "invalid-id" não encontrado')
    }
  })
})
