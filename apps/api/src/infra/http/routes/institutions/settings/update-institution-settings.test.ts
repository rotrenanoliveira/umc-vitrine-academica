import { appForTest as app } from '@tests/app'
import {
  makeInstitutionMemberOnDatabase,
  makeInstitutionOnDatabase,
  makeInstitutionSettingsOnDatabase,
} from '@tests/factories/make-institution'
import { makeUserOnDatabase } from '@tests/factories/make-user'
import request from 'supertest'
import { InstitutionMemberType } from '@/domain/institution/enterprise/entities/institution-member'

describe('(E2E) - PUT /api/v1/institutions/:institutionId/settings', () => {
  afterAll(async () => await app.close())

  it('should be able to update institution settings', async () => {
    const { user } = await makeUserOnDatabase()
    const { institution } = await makeInstitutionOnDatabase({ registerBy: user.id })
    await makeInstitutionSettingsOnDatabase({ institutionId: institution.id })
    await makeInstitutionMemberOnDatabase({
      userId: user.id,
      institutionId: institution.id,
      type: InstitutionMemberType.MANAGER,
    })

    const response = await request(app.server)
      .put(`/api/v1/institutions/${institution.id.toString()}/settings`)
      .send({
        actorId: user.id.toString(),
        shouldProof: true,
        shouldVerify: true,
      })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      settings: expect.objectContaining({
        institutionId: institution.id.toString(),
        shouldProof: true,
        shouldVerify: true,
      }),
    })
  })

  it('should not be able to update settings when the user is not authorized', async () => {
    const { user } = await makeUserOnDatabase()
    const { institution } = await makeInstitutionOnDatabase({ registerBy: user.id })
    await makeInstitutionSettingsOnDatabase({ institutionId: institution.id })

    const response = await request(app.server)
      .put(`/api/v1/institutions/${institution.id.toString()}/settings`)
      .send({
        actorId: user.id.toString(),
        shouldProof: true,
        shouldVerify: true,
      })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ message: expect.any(String) })
  })
})
