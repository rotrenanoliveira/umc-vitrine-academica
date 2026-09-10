import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { makeFetchPublishedProjectsController } from '../../factories/project/make-fetch-published-projects-controller'

const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  authorId: z.string(),
  status: z.enum(['SKETCH', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED']),
  attachments: z.array(z.string()),
  tags: z.array(z.string()),
  createdAt: z.iso.datetime(),
})

export async function fetchPublishedProjectsRoute(app: FastifyInstance) {
  const fetchPublishedProjectsController = makeFetchPublishedProjectsController()

  app.withTypeProvider<ZodTypeProvider>().get(
    '/projects/published',
    {
      schema: {
        tags: ['projects'],
        summary: 'Listar projetos publicados',
        description: 'Lista os projetos publicados cuja data de agendamento corresponde à data informada',
        querystring: z.object({
          date: z.coerce.date().optional().describe('A data de referência para filtrar publicações'),
        }),
        response: {
          200: z.object({
            projects: z.array(projectSchema),
          }),
        },
      },
    },
    async (request, reply) => {
      return fetchPublishedProjectsController.handle(request.query, reply)
    },
  )
}
