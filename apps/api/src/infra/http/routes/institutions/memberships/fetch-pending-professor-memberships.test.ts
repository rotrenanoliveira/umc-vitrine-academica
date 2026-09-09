import { appForTest as app } from '@tests/app'
import { makeInstitutionMemberOnDatabase, makeInstitutionOnDatabase } from '@tests/factories/make-institution'
import { makeUserOnDatabase } from '@tests/factories/make-user'
import request from 'supertest'
import {
  InstitutionMemberStatus,
  InstitutionMemberType,
} from '@/domain/institution/enterprise/entities/institution-member'

describe('(E2E) - GET /api/v1/institutions/:institutionId/memberships/professors/pending', () => {
  afterAll(async () => await app.close())

  it('should be able to fetch pending professor memberships', async () => {
    const { user: manager } = await makeUserOnDatabase()
    const { user: professor } = await makeUserOnDatabase()
    const { institution } = await makeInstitutionOnDatabase({ registerBy: manager.id })
    await makeInstitutionMemberOnDatabase({
      userId: manager.id,
      institutionId: institution.id,
      type: InstitutionMemberType.ADMINISTRATIVE_OFFICE,
    })
    await makeInstitutionMemberOnDatabase({
      userId: professor.id,
      institutionId: institution.id,
      type: InstitutionMemberType.PROFESSOR,
      status: InstitutionMemberStatus.PENDING,
    })

    const response = await request(app.server)
      .get(`/api/v1/institutions/${institution.id.toString()}/memberships/professors/pending`)
      .query({ actorId: manager.id.toString() })

    expect(response.status).toBe(200)
    expect(response.body.members).toHaveLength(1)
    expect(response.body.members[0].type).toBe('PROFESSOR')
  })
})
