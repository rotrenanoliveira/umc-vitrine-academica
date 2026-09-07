import { appForTest as app } from '@tests/app'
import { makeTagOnDatabase } from '@tests/factories/make-tag'
import request from 'supertest'

describe('(E2E) - GET /api/v1/tags', () => {
  afterAll(async () => await app.close())

  it('should be able to fetch all tags', async () => {
    for (let i = 0; i < 5; i++) {
      await makeTagOnDatabase({ name: `tag-${i}` })
    }

    const response = await request(app.server).get('/api/v1/tags').send()

    expect(response.status).toBe(200)
    expect(response.body.tags).toHaveLength(5)
    expect(response.body.tags[0].name).toBe('tag-0')
  })
})
