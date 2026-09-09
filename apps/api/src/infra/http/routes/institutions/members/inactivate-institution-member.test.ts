import { appForTest as app } from '@tests/app'
import { makeInstitutionMemberOnDatabase, makeInstitutionOnDatabase } from '@tests/factories/make-institution'
import { makeUserOnDatabase } from '@tests/factories/make-user'
import request from 'supertest'
import { InstitutionMemberType } from '@/domain/institution/enterprise/entities/institution-member'

describe('(E2E) - PUT /api/v1/institutions/members/:memberId/inactivate', () => {
  afterAll(async () => await app.close())

  it('should be able to inactivate an institution member', async () => {
    const { user: manager } = await makeUserOnDatabase()
    const { user: memberUser } = await makeUserOnDatabase()
    const { institution } = await makeInstitutionOnDatabase({ registerBy: manager.id })
    await makeInstitutionMemberOnDatabase({
      userId: manager.id,
      institutionId: institution.id,
      type: InstitutionMemberType.MANAGER,
    })
    const { member } = await makeInstitutionMemberOnDatabase({
      userId: memberUser.id,
      institutionId: institution.id,
      type: InstitutionMemberType.STUDENT,
    })

    const response = await request(app.server)
      .put(`/api/v1/institutions/members/${member.id.toString()}/inactivate`)
      .send({ actorId: manager.id.toString() })

    expect(response.status).toBe(200)
    expect(response.body.member.status).toBe('INACTIVE')
  })
})
