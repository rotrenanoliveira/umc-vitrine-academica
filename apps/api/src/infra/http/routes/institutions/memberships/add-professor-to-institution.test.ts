import { appForTest as app } from '@tests/app'
import { makeInstitutionMemberOnDatabase, makeInstitutionOnDatabase } from '@tests/factories/make-institution'
import { makeUserOnDatabase } from '@tests/factories/make-user'
import request from 'supertest'
import { InstitutionMemberType } from '@/domain/institution/enterprise/entities/institution-member'

describe('(E2E) - POST /api/v1/institutions/:institutionId/professors', () => {
  afterAll(async () => await app.close())

  it('should be able to add a professor to an institution', async () => {
    const { user: manager } = await makeUserOnDatabase()
    const { user: professor } = await makeUserOnDatabase()
    const { institution } = await makeInstitutionOnDatabase({ registerBy: manager.id })
    await makeInstitutionMemberOnDatabase({
      userId: manager.id,
      institutionId: institution.id,
      type: InstitutionMemberType.MANAGER,
    })

    const response = await request(app.server)
      .post(`/api/v1/institutions/${institution.id.toString()}/professors`)
      .send({
        userId: professor.id.toString(),
        actorId: manager.id.toString(),
      })

    expect(response.status).toBe(201)
    expect(response.body.member).toEqual(
      expect.objectContaining({
        userId: professor.id.toString(),
        type: 'PROFESSOR',
        status: 'ACTIVE',
      }),
    )
  })
})
