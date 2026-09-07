import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { makeFetchTagsController } from '../../factories/tag/make-fetch-tags-controller'

export async function fetchTagsRoute(app: FastifyInstance) {
  const fetchTagsController = makeFetchTagsController()

  app.withTypeProvider<ZodTypeProvider>().get(
    '/tags',
    {
      schema: {
        tags: ['tags'],
        summary: 'Busca todas as tags',
        description: 'Busca todas as tags na aplicação',
        response: {
          200: z.object({
            tags: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                slug: z.string(),
                status: z.enum(['ACTIVE', 'INACTIVE']),
              }),
            ),
          }),
          409: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (_, reply) => {
      return fetchTagsController.handle(reply)
    },
  )
}
