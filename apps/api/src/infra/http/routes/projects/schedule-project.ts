import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { makeScheduleProjectController } from '../../factories/project/make-schedule-project-controller'

export async function scheduleProjectRoute(app: FastifyInstance) {
  const scheduleProjectController = makeScheduleProjectController()

  app.withTypeProvider<ZodTypeProvider>().post(
    '/projects/:projectId/schedule',
    {
      schema: {
        tags: ['projects'],
        summary: 'Agendar publicação de um projeto',
        description: 'Agenda a publicação de um projeto em rascunho para uma data específica',
        params: z.object({
          projectId: z.uuid().describe('O ID do projeto'),
        }),
        body: z.object({
          publishedIn: z.coerce.date().describe('A data de publicação agendada'),
        }),
        response: {
          201: z.object({
            projectScheduled: z.object({
              id: z.string(),
              projectId: z.string(),
              publishedIn: z.iso.datetime(),
              createdAt: z.iso.datetime(),
            }),
          }),
          404: z.object({
            message: z.string(),
          }),
          409: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      return scheduleProjectController.handle(request.params, request.body, reply)
    },
  )
}
