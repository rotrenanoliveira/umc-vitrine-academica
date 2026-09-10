import { appForTest as app } from '@tests/app'
import { makeProjectOnDatabase } from '@tests/factories/make-project'
import { makeProjectScheduledOnDatabase } from '@tests/factories/make-project-scheduled'
import { makeUserOnDatabase } from '@tests/factories/make-user'
import request from 'supertest'
import { ProjectStatus } from '@/domain/project/enterprise/entities/project'

describe('(E2E) - GET /api/v1/projects/published', () => {
  afterAll(async () => await app.close())

  it('deve ser possivel buscar projetos publicados em uma data', async () => {
    const { user } = await makeUserOnDatabase()
    const publishedIn = new Date('2030-06-10T10:00:00.000Z')
    const { project } = await makeProjectOnDatabase({
      author: user.id,
      status: ProjectStatus.PUBLISHED,
    })

    await makeProjectScheduledOnDatabase({
      projectId: project.id,
      publishedIn,
    })

    const response = await request(app.server)
      .get('/api/v1/projects/published')
      .query({ date: publishedIn.toISOString() })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      projects: [
        {
          id: project.id.toString(),
          title: project.title,
          description: project.description,
          authorId: user.id.toString(),
          status: 'PUBLISHED',
          attachments: [],
          tags: [],
          createdAt: expect.any(String),
        },
      ],
    })
  })
})
