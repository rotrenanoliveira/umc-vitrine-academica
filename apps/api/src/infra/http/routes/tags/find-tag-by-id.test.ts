import { appForTest as app } from '@tests/app'
import { makeTagOnDatabase } from '@tests/factories/make-tag'
import request from 'supertest'

describe('(E2E) - GET /api/v1/tags/:tagId', () => {
  afterAll(async () => await app.close())

  it('should be able to find a tag by id', async () => {
    const { tag } = await makeTagOnDatabase()
    const tagId = tag.id.toString()

    const response = await request(app.server).get(`/api/v1/tags/${tagId}`).send()

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
