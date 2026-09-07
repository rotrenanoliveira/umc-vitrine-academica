import { appForTest as app } from '@tests/app'
import { makeTagOnDatabase } from '@tests/factories/make-tag'
import request from 'supertest'

describe('(E2E) - PUT /api/v1/tags/:tagId', () => {
  afterAll(async () => await app.close())

  it('should be able to update a tag', async () => {
    const { tag } = await makeTagOnDatabase()
    const tagId = tag.id.toString()

    const response = await request(app.server).put(`/api/v1/tags/${tagId}`).send({
      status: 'INACTIVE',
    })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      tag: {
        id: expect.any(String),
        name: tag.name,
        slug: tag.slug.value,
        status: 'INACTIVE',
      },
    })
  })
})
