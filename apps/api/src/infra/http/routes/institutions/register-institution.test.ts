import { appForTest as app } from '@tests/app'
import { makeInstitution, makeInstitutionOnDatabase } from '@tests/factories/make-institution'
import { makeUserOnDatabase } from '@tests/factories/make-user'
import request from 'supertest'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InstitutionType } from '@/domain/institution/enterprise/entities/institution'

describe('(E2E) - POST /api/v1/institutions', () => {
  afterAll(async () => await app.close())

  it('should be able to register a new institution', async () => {
    const { user } = await makeUserOnDatabase()
    const { institution } = makeInstitution({
      registerBy: new UniqueEntityId(user.id.toString()),
    })

    const response = await request(app.server).post('/api/v1/institutions').send({
      name: institution.name,
      type: institution.type,
      description: institution.description,
      registeredBy: user.id.toString(),
      shouldProof: true,
      shouldVerify: false,
    })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      institution: {
        id: expect.any(String),
        name: institution.name,
        slug: institution.slug.value,
        type: InstitutionType.UNIVERSITY,
        status: 'ACTIVE',
        origin: 'ADMIN',
        description: institution.description,
        registerBy: user.id.toString(),
        createdAt: expect.any(String),
        updatedAt: null,
      },
      settings: {
        id: expect.any(String),
        institutionId: expect.any(String),
        shouldProof: true,
        shouldVerify: false,
        domain: null,
        updatedAt: null,
      },
    })
    expect(response.body.settings.institutionId).toBe(response.body.institution.id)
  })

  it('should not be able to register an institution when it already exists', async () => {
    const { user } = await makeUserOnDatabase()
    const { institution } = await makeInstitutionOnDatabase({
      registerBy: user.id,
    })

    const response = await request(app.server).post('/api/v1/institutions').send({
      name: institution.name,
      type: institution.type,
      description: institution.description,
      registeredBy: user.id.toString(),
    })

    expect(response.status).toBe(409)
    expect(response.body).toEqual({
      message: expect.any(String),
    })
  })
})
