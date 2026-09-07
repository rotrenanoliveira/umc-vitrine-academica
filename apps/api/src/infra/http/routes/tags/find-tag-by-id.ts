import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { makeFindTagByIdController } from '../../factories/tag/make-find-tag-by-id-controller'

export async function findTagByIdRoute(app: FastifyInstance) {
  const findTagByIdController = makeFindTagByIdController()

  app.withTypeProvider<ZodTypeProvider>().get(
    '/tags/:tagId',
    {
      schema: {
        tags: ['tags'],
        summary: 'Busca uma tag pelo id',
        description: 'Busca uma tag pelo id na aplicação',
        params: z.object({
          tagId: z.string().describe('O id da tag'),
        }),
        response: {
          201: z.object({
            tag: z.object({
              id: z.string(),
              name: z.string(),
              slug: z.string(),
              status: z.enum(['ACTIVE', 'INACTIVE']),
            }),
          }),
          409: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      return findTagByIdController.handle(request.params, reply)
    },
  )
}
