import { appForTest as app } from '@tests/app'
import { makeInstitutionMemberOnDatabase, makeInstitutionOnDatabase } from '@tests/factories/make-institution'
import { makeUserOnDatabase } from '@tests/factories/make-user'
import request from 'supertest'
import { InstitutionMemberType } from '@/domain/institution/enterprise/entities/institution-member'

describe('(E2E) - POST /api/v1/institutions/:institutionId/students', () => {
  afterAll(async () => await app.close())

  it('should be able to add a student to an institution', async () => {
    const { user: manager } = await makeUserOnDatabase()
    const { user: student } = await makeUserOnDatabase()
    const { institution } = await makeInstitutionOnDatabase({ registerBy: manager.id })
    await makeInstitutionMemberOnDatabase({
      userId: manager.id,
      institutionId: institution.id,
      type: InstitutionMemberType.MANAGER,
    })

    const response = await request(app.server)
      .post(`/api/v1/institutions/${institution.id.toString()}/students`)
      .send({
        userId: student.id.toString(),
        actorId: manager.id.toString(),
      })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      member: expect.objectContaining({
        userId: student.id.toString(),
        institutionId: institution.id.toString(),
        type: 'STUDENT',
        status: 'ACTIVE',
      }),
    })
  })
})
