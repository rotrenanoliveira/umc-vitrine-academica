import { appForTest as app } from '@tests/app'
import { makeInstitutionOnDatabase } from '@tests/factories/make-institution'
import { makeUserOnDatabase } from '@tests/factories/make-user'
import request from 'supertest'
import { InstitutionStatus } from '@/domain/institution/enterprise/entities/institution'

describe('(E2E) - GET /api/v1/institutions/active', () => {
  afterAll(async () => await app.close())

  it('should be able to fetch only active institutions', async () => {
    const { user } = await makeUserOnDatabase()

    await makeInstitutionOnDatabase({ registerBy: user.id, status: InstitutionStatus.ACTIVE })
    await makeInstitutionOnDatabase({ registerBy: user.id, status: InstitutionStatus.INACTIVE })

    const response = await request(app.server).get('/api/v1/institutions/active')

    expect(response.status).toBe(200)
    expect(response.body.institutions).toHaveLength(1)
    expect(response.body.institutions[0].status).toBe('ACTIVE')
  })
})
