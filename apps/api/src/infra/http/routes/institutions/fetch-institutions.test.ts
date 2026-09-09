import { appForTest as app } from '@tests/app'
import { makeInstitutionOnDatabase } from '@tests/factories/make-institution'
import { makeUserOnDatabase } from '@tests/factories/make-user'
import request from 'supertest'

describe('(E2E) - GET /api/v1/institutions', () => {
  afterAll(async () => await app.close())

  it('should be able to fetch all institutions', async () => {
    const { user } = await makeUserOnDatabase()

    await makeInstitutionOnDatabase({ registerBy: user.id })
    await makeInstitutionOnDatabase({ registerBy: user.id })

    const response = await request(app.server).get('/api/v1/institutions')

    expect(response.status).toBe(200)
    expect(response.body.institutions).toHaveLength(2)
    expect(response.body.institutions[0]).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      slug: expect.any(String),
      type: expect.any(String),
      status: expect.any(String),
      origin: expect.any(String),
      description: expect.any(String),
      registerBy: user.id.toString(),
      createdAt: expect.any(String),
      updatedAt: expect.toBeOneOf([null, expect.any(String)]),
    })
  })
})
