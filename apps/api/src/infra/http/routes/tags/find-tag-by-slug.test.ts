import { appForTest as app } from '@tests/app'
import { makeTagOnDatabase } from '@tests/factories/make-tag'
import request from 'supertest'

describe('(E2E) - GET /api/v1/tags/:slug', () => {
  afterAll(async () => await app.close())

  it('should be able to register a new tag', async () => {
    const { tag } = await makeTagOnDatabase()
    const tagSlug = tag.slug.value

    const response = await request(app.server).get(`/api/v1/tags/slug/${tagSlug}`).send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      tag: {
        id: tag.id.toString(),
        name: tag.name,
        slug: tag.slug.value,
        status: 'ACTIVE',
      },
    })
  })
})
