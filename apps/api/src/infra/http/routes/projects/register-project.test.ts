import { appForTest as app } from '@tests/app'
import { makeProject } from '@tests/factories/make-project'
import { makeUserOnDatabase } from '@tests/factories/make-user'
import request from 'supertest'

describe('(E2E) - POST /api/v1/projects', () => {
  afterAll(async () => await app.close())

  it('deve ser possivel registrar um projeto', async () => {
    const { user } = await makeUserOnDatabase()
    const { project } = makeProject({ author: user.id })

    const response = await request(app.server).post('/api/v1/projects').send({
      title: project.title,
      description: project.description,
      authorId: user.id.toString(),
    })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      project: {
        id: expect.any(String),
        title: project.title,
        description: project.description,
        authorId: user.id.toString(),
        status: 'SKETCH',
        attachments: [],
        tags: [],
        createdAt: expect.any(String),
      },
    })
  })
})
