import { makeTag } from '@tests/factories/make-tag'
import { InMemoryTagsRepository } from '@tests/repositories/in-memory-tags-repository'
import { FetchTagsUseCase } from './fetch-tags'

let tagsRepository: InMemoryTagsRepository
let sut: FetchTagsUseCase

describe('(UC) - Fetch Tags', () => {
  beforeEach(() => {
    tagsRepository = new InMemoryTagsRepository()
    sut = new FetchTagsUseCase(tagsRepository)
  })

  it('should be able to fetch all tags', async () => {
    for (let i = 0; i < 5; i++) {
      const { tag } = makeTag({ name: `tag-${i}` })
      tagsRepository.items.push(tag)
    }

    const result = await sut.execute()

    expect(result.isRight())

    if (result.isRight()) {
      expect(result.value.tags.length).toBe(5)
    }
  })
})
