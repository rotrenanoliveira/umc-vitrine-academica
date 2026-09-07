import { makeTag } from '@tests/factories/make-tag'
import { InMemoryTagsRepository } from '@tests/repositories/in-memory-tags-repository'
import { FindTagBySlugUseCase } from './find-tag-by-slug'

let tagsRepository: InMemoryTagsRepository
let sut: FindTagBySlugUseCase

describe('(UC) - Bind Tag By Slug', () => {
  beforeEach(() => {
    tagsRepository = new InMemoryTagsRepository()
    sut = new FindTagBySlugUseCase(tagsRepository)
  })

  it('should be able to find tag by slug', async () => {
    for (let i = 0; i < 5; i++) {
      const { tag } = makeTag({ name: `tag-${i}` })
      tagsRepository.items.push(tag)
    }

    const { tag } = makeTag()

    const result = await sut.execute({
      slug: tag.slug.toString(),
    })

    expect(result.isRight())

    if (result.isRight()) {
      expect(result.value.tag.name).toBe(tag.name)
      expect(result.value.tag.slug.value).toBe(tag.slug.value)
    }
  })

  it('should not be able to find tag with invalid slug slug', async () => {
    const result = await sut.execute({
      slug: 'invalid-slug',
    })

    expect(result.isLeft())

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(Error)
      expect(result.value.message).toBe('Tag com slug "invalid-slug" não encontrado')
    }
  })
})
