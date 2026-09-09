import { appForTest as app } from '@tests/app'
import { makeInstitutionMemberOnDatabase, makeInstitutionOnDatabase } from '@tests/factories/make-institution'
import { makeUserOnDatabase } from '@tests/factories/make-user'
import request from 'supertest'
import { InstitutionStatus } from '@/domain/institution/enterprise/entities/institution'
import { InstitutionMemberType } from '@/domain/institution/enterprise/entities/institution-member'

describe('(E2E) - PUT /api/v1/institutions/:institutionId/activate', () => {
  afterAll(async () => await app.close())

  it('should be able to activate an institution', async () => {
    const { user } = await makeUserOnDatabase()
    const { institution } = await makeInstitutionOnDatabase({
      registerBy: user.id,
      status: InstitutionStatus.INACTIVE,
    })

    await makeInstitutionMemberOnDatabase({
      userId: user.id,
      institutionId: institution.id,
      type: InstitutionMemberType.MANAGER,
    })

    const response = await request(app.server)
      .put(`/api/v1/institutions/${institution.id.toString()}/activate`)
      .send({
        actorId: user.id.toString(),
      })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      institution: expect.objectContaining({
        id: institution.id.toString(),
        status: 'ACTIVE',
      }),
    })
  })

  it('should not be able to activate an institution when it does not exist', async () => {
    const { user } = await makeUserOnDatabase()

    const response = await request(app.server).put('/api/v1/institutions/missing-id/activate').send({
      actorId: user.id.toString(),
    })

    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      message: expect.any(String),
    })
  })
})
