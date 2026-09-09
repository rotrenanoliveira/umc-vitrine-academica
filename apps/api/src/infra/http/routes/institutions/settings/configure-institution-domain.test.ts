import { appForTest as app } from '@tests/app'
import {
  makeInstitutionMemberOnDatabase,
  makeInstitutionOnDatabase,
  makeInstitutionSettingsOnDatabase,
} from '@tests/factories/make-institution'
import { makeUserOnDatabase } from '@tests/factories/make-user'
import request from 'supertest'
import { InstitutionMemberType } from '@/domain/institution/enterprise/entities/institution-member'

describe('(E2E) - PUT /api/v1/institutions/:institutionId/domain', () => {
  afterAll(async () => await app.close())

  it('should be able to configure an institution domain', async () => {
    const { user } = await makeUserOnDatabase()
    const { institution } = await makeInstitutionOnDatabase({ registerBy: user.id })
    await makeInstitutionSettingsOnDatabase({ institutionId: institution.id })
    await makeInstitutionMemberOnDatabase({
      userId: user.id,
      institutionId: institution.id,
      type: InstitutionMemberType.ADMINISTRATIVE_OFFICE,
    })

    const response = await request(app.server)
      .put(`/api/v1/institutions/${institution.id.toString()}/domain`)
      .send({
        actorId: user.id.toString(),
        domain: 'umc.br',
      })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      settings: expect.objectContaining({
        institutionId: institution.id.toString(),
        domain: 'umc.br',
      }),
    })
  })
})
