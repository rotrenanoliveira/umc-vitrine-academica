import { appForTest as app } from '@tests/app'
import { makeInstitutionMemberOnDatabase, makeInstitutionOnDatabase } from '@tests/factories/make-institution'
import { makeUserOnDatabase } from '@tests/factories/make-user'
import request from 'supertest'
import {
  InstitutionMemberStatus,
  InstitutionMemberType,
} from '@/domain/institution/enterprise/entities/institution-member'

describe('(E2E) - GET /api/v1/institutions/:institutionId/memberships/students/pending', () => {
  afterAll(async () => await app.close())

  it('should be able to fetch pending student memberships', async () => {
    const { user: manager } = await makeUserOnDatabase()
    const { user: student } = await makeUserOnDatabase()
    const { institution } = await makeInstitutionOnDatabase({ registerBy: manager.id })
    await makeInstitutionMemberOnDatabase({
      userId: manager.id,
      institutionId: institution.id,
      type: InstitutionMemberType.MANAGER,
    })
    await makeInstitutionMemberOnDatabase({
      userId: student.id,
      institutionId: institution.id,
      type: InstitutionMemberType.STUDENT,
      status: InstitutionMemberStatus.PENDING,
    })

    const response = await request(app.server)
      .get(`/api/v1/institutions/${institution.id.toString()}/memberships/students/pending`)
      .query({ actorId: manager.id.toString() })

    expect(response.status).toBe(200)
    expect(response.body.members).toHaveLength(1)
    expect(response.body.members[0]).toEqual(
      expect.objectContaining({
        userId: student.id.toString(),
        status: 'PENDING',
        type: 'STUDENT',
      }),
    )
  })
})
