import { appForTest as app } from '@tests/app'
import { makeInstitutionMemberOnDatabase, makeInstitutionOnDatabase } from '@tests/factories/make-institution'
import { makeUserOnDatabase } from '@tests/factories/make-user'
import request from 'supertest'
import { InstitutionMemberType } from '@/domain/institution/enterprise/entities/institution-member'

describe('(E2E) - POST /api/v1/institutions/:institutionId/leave', () => {
  afterAll(async () => await app.close())

  it('should be able to leave an institution', async () => {
    const { user } = await makeUserOnDatabase()
    const { institution } = await makeInstitutionOnDatabase({ registerBy: user.id })
    await makeInstitutionMemberOnDatabase({
      userId: user.id,
      institutionId: institution.id,
      type: InstitutionMemberType.STUDENT,
    })

    const response = await request(app.server)
      .post(`/api/v1/institutions/${institution.id.toString()}/leave`)
      .send({ userId: user.id.toString() })

    expect(response.status).toBe(200)
    expect(response.body.member).toEqual(
      expect.objectContaining({
        userId: user.id.toString(),
        status: 'FINISHED',
      }),
    )
  })
})
