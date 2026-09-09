import { appForTest as app } from '@tests/app'
import { makeInstitutionMemberOnDatabase, makeInstitutionOnDatabase } from '@tests/factories/make-institution'
import { makeUserOnDatabase } from '@tests/factories/make-user'
import request from 'supertest'
import { InstitutionMemberType } from '@/domain/institution/enterprise/entities/institution-member'

describe('(E2E) - PUT /api/v1/institutions/:institutionId', () => {
  afterAll(async () => await app.close())

  it('should be able to edit an institution', async () => {
    const { user } = await makeUserOnDatabase()
    const { institution } = await makeInstitutionOnDatabase({ registerBy: user.id })

    await makeInstitutionMemberOnDatabase({
      userId: user.id,
      institutionId: institution.id,
      type: InstitutionMemberType.MANAGER,
    })

    const response = await request(app.server).put(`/api/v1/institutions/${institution.id.toString()}`).send({
      actorId: user.id.toString(),
      name: 'Universidade Atualizada',
      description: 'Nova descrição',
    })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      institution: expect.objectContaining({
        id: institution.id.toString(),
        name: 'Universidade Atualizada',
        description: 'Nova descrição',
      }),
    })
  })

  it('should not be able to edit an institution when it does not exist', async () => {
    const { user } = await makeUserOnDatabase()

    const response = await request(app.server).put('/api/v1/institutions/missing-id').send({
      actorId: user.id.toString(),
      name: 'Universidade Atualizada',
    })

    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      message: expect.any(String),
    })
  })

  it('should not be able to edit an institution when the user is not authorized', async () => {
    const { user } = await makeUserOnDatabase()
    const { institution } = await makeInstitutionOnDatabase({ registerBy: user.id })

    const response = await request(app.server).put(`/api/v1/institutions/${institution.id.toString()}`).send({
      actorId: user.id.toString(),
      name: 'Universidade Atualizada',
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      message: expect.any(String),
    })
  })
})
