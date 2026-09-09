import { appForTest as app } from '@tests/app'
import { makeInstitutionOnDatabase } from '@tests/factories/make-institution'
import { makeUserOnDatabase } from '@tests/factories/make-user'
import request from 'supertest'

describe('(E2E) - POST /api/v1/institutions/:institutionId/settings', () => {
  afterAll(async () => await app.close())

  it('should be able to register institution settings', async () => {
    const { user } = await makeUserOnDatabase()
    const { institution } = await makeInstitutionOnDatabase({ registerBy: user.id })

    const response = await request(app.server)
      .post(`/api/v1/institutions/${institution.id.toString()}/settings`)
      .send({
        shouldProof: false,
        shouldVerify: true,
      })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      settings: expect.objectContaining({
        institutionId: institution.id.toString(),
        shouldProof: false,
        shouldVerify: true,
      }),
    })
  })

  it('should not be able to register settings when the institution does not exist', async () => {
    const response = await request(app.server).post('/api/v1/institutions/missing-id/settings').send({
      shouldProof: false,
      shouldVerify: false,
    })

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ message: expect.any(String) })
  })
})
