import { appForTest as app } from '@tests/app'
import { makeInstitutionMemberOnDatabase, makeInstitutionOnDatabase } from '@tests/factories/make-institution'
import { makeUserOnDatabase } from '@tests/factories/make-user'
import request from 'supertest'
import { InstitutionMemberType } from '@/domain/institution/enterprise/entities/institution-member'

describe('(E2E) - PUT /api/v1/institutions/members/:memberId/professors/remove', () => {
  afterAll(async () => await app.close())

  it('should be able to remove a professor from an institution', async () => {
    const { user: manager } = await makeUserOnDatabase()
    const { user: professor } = await makeUserOnDatabase()
    const { institution } = await makeInstitutionOnDatabase({ registerBy: manager.id })
    await makeInstitutionMemberOnDatabase({
      userId: manager.id,
      institutionId: institution.id,
      type: InstitutionMemberType.ADMINISTRATIVE_OFFICE,
    })
    const { member } = await makeInstitutionMemberOnDatabase({
      userId: professor.id,
      institutionId: institution.id,
      type: InstitutionMemberType.PROFESSOR,
    })

    const response = await request(app.server)
      .put(`/api/v1/institutions/members/${member.id.toString()}/professors/remove`)
      .send({
        actorId: manager.id.toString(),
        status: 'INACTIVE',
      })

    expect(response.status).toBe(200)
    expect(response.body.member.status).toBe('INACTIVE')
  })
})
