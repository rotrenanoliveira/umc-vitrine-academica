import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { makeFindTagBySlugController } from '../../factories/tag/make-find-tag-by-slug-controller'

export async function findTagBySlugRoute(app: FastifyInstance) {
  const findTagBySlugController = makeFindTagBySlugController()

  app.withTypeProvider<ZodTypeProvider>().get(
    '/tags/slug/:slug',
    {
      schema: {
        tags: ['tags'],
        summary: 'Busca uma tag pelo slug',
        description: 'Busca uma tag pelo slug na aplicação',
        params: z.object({
          slug: z.string().describe('O slug da tag'),
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
      return findTagBySlugController.handle(request.params, reply)
    },
  )
}
